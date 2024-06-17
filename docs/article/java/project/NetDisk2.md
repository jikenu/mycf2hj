# NetDisk Day2



### 文件分片上传

业务逻辑&上传：

参数详解：webUserDto：前端默认传递的用户信息，fileId：文件id，file：每次分片的文件，fileName：文件名，filePid：文件父级id，fileMd5：文件md5信息（与id相似），chunkIndex：当前是第几片文件，chunks：文件总片数

chunkIndex == 0判断：在第0块文件时作判断，设置md5，status查询条件进行查询，如果数据库存在此file信息，则说明该文件已经存在文件库中，dbFileList.get(0)(对数据重新赋值，这里相当于new一个对象??) 取出一条数据，重新赋值后插入数据库即可

```java
// FileInfoServiceImpl
// 文件上传 业务逻辑
    @Override
    @Transactional(rollbackFor = Exception.class)
    public UploadResultDto uploadFile(SessionWebUserDto webUserDto, String fileId, MultipartFile file, String fileName, String filePid, String fileMd5,
                                      Integer chunkIndex, Integer chunks) {
        File tempFileFolder = null;
        Boolean uploadSuccess = true;  //上传成功标志
        try {
            UploadResultDto resultDto = new UploadResultDto();
            //检查文件ID是否为空，如果为空则生成一个随机的文件ID
            if (StringTools.isEmpty(fileId)) {
                fileId = StringTools.getRandomString(Constants.LENGTH_10);
            }
            resultDto.setFileId(fileId);
            Date curDate = new Date();
            // 从redis中获取用户空间
            UserSpaceDto spaceDto = redisComponent.getUserSpaceUse(webUserDto.getUserId());
            // chunkIndex == 0 代表分片上传的第0个块， 在第0片检测文件是否已经存在
            if (chunkIndex == 0) {
                FileInfoQuery infoQuery = new FileInfoQuery();
                infoQuery.setFileMd5(fileMd5);
                infoQuery.setSimplePage(new SimplePage(0, 1));
                infoQuery.setStatus(FileStatusEnums.USING.getStatus());
                List<FileInfo> dbFileList = this.fileInfoMapper.selectList(infoQuery);
                //秒传
                if (!dbFileList.isEmpty()) {
                    FileInfo dbFile = dbFileList.get(0); // 相当与new一个对象
                    //判断文件加已用大小是否超过限制大小
                    if (dbFile.getFileSize() + spaceDto.getUseSpace() > spaceDto.getTotalSpace()) {
                        throw new BusinessException(ResponseCodeEnum.CODE_904);
                    }
                    dbFile.setFileId(fileId);
                    dbFile.setFilePid(filePid);
                    dbFile.setUserId(webUserDto.getUserId());
                    dbFile.setFileMd5(null);
                    dbFile.setCreateTime(curDate);
                    dbFile.setLastUpdateTime(curDate);
                    dbFile.setStatus(FileStatusEnums.USING.getStatus());
                    dbFile.setDelFlag(FileDelFlagEnums.USING.getFlag());
                    dbFile.setFileMd5(fileMd5);
                    fileName = autoRename(filePid, webUserDto.getUserId(), fileName);
                    dbFile.setFileName(fileName);
                    this.fileInfoMapper.insert(dbFile);
                    resultDto.setStatus(UploadStatusEnums.UPLOAD_SECONDS.getCode());
                    //更新用户空间使用
                    updateUserSpace(webUserDto, dbFile.getFileSize());

                    return resultDto;
                }
            }

            //暂存在临时目录
            String tempFolderName = appConfig.getProjectFolder() + Constants.FILE_FOLDER_TEMP;
            String currentUserFolderName = webUserDto.getUserId() + fileId;
            //创建临时目录
            tempFileFolder = new File(tempFolderName + currentUserFolderName);
            if (!tempFileFolder.exists()) {
                tempFileFolder.mkdirs();
            }

            //判断用户空间
            Long currentTempSize = redisComponent.getFileTempSize(webUserDto.getUserId(), fileId);
            if (file.getSize() + currentTempSize + spaceDto.getUseSpace() > spaceDto.getTotalSpace()) {
                throw new BusinessException(ResponseCodeEnum.CODE_904);
            }

            //创建一块文件  根据片数确认是第几片
            File newFile = new File(tempFileFolder.getPath() + "/" + chunkIndex);
            file.transferTo(newFile);
            // 每传一片，更新临时大小
            redisComponent.saveFileTempSize(webUserDto.getUserId(), fileId, file.getSize());

            //不是最后一个分片，直接返回
            if (chunkIndex < chunks - 1) {
                resultDto.setStatus(UploadStatusEnums.UPLOADING.getCode());
                return resultDto;
            }

            //最后一个分片上传完成，记录数据库，异步合并分片
            String month = DateUtil.format(curDate, DateTimePatternEnum.YYYYMM.getPattern());
            String fileSuffix = StringTools.getFileSuffix(fileName);
            // 真实文件名
            String realFileName = currentUserFolderName + fileSuffix;
            FileTypeEnums fileTypeEnum = FileTypeEnums.getFileTypeBySuffix(fileSuffix);
            // 自动重命名
            fileName = autoRename(filePid, webUserDto.getUserId(), fileName);
            // 封装文件信息
            FileInfo fileInfo = new FileInfo();
            fileInfo.setFileId(fileId);
            fileInfo.setUserId(webUserDto.getUserId());
            fileInfo.setFileMd5(fileMd5);
            fileInfo.setFileName(fileName);
            fileInfo.setFilePath(month + "/" + realFileName);
            fileInfo.setFilePid(filePid);
            fileInfo.setCreateTime(curDate);
            fileInfo.setLastUpdateTime(curDate);
            fileInfo.setFileCategory(fileTypeEnum.getCategory().getCategory());
            fileInfo.setFileType(fileTypeEnum.getType());
            fileInfo.setStatus(FileStatusEnums.TRANSFER.getStatus());
            fileInfo.setFolderType(FileFolderTypeEnums.FILE.getType());
            fileInfo.setDelFlag(FileDelFlagEnums.USING.getFlag());
            this.fileInfoMapper.insert(fileInfo);

            Long totalSize = redisComponent.getFileTempSize(webUserDto.getUserId(), fileId);
            updateUserSpace(webUserDto, totalSize);

            resultDto.setStatus(UploadStatusEnums.UPLOAD_FINISH.getCode());
            
            //事务提交后调用异步方法  合并文件
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    fileInfoService.transferFile(fileInfo.getFileId(), webUserDto);
                }
            });
            return resultDto;
        } catch (BusinessException e) {
            uploadSuccess = false;
            logger.error("文件上传失败", e);
            throw e;
        } catch (Exception e) {
            uploadSuccess = false;
            logger.error("文件上传失败", e);
            throw new BusinessException("文件上传失败");
        } finally {
            //如果上传失败，清除临时目录
            if (tempFileFolder != null && !uploadSuccess) {
                try {
                    FileUtils.deleteDirectory(tempFileFolder);
                } catch (IOException e) {
                    logger.error("删除临时目录失败");
                }
            }
        }
    }
```

合并文件 业务逻辑：

参数解析：fileId：文件id，webUserDto：用户信息

先selectByFileIdAndUserId获取具体文件信息，判断文件不为空且状态值正常；

再获取临时目录、文件后缀、月份， 获取目标目录，拼接出真是文件 **全路径**targetFilePath

接着执行合并文件的实现方法

然后判断文件类型生成对应缩略图

最后finally块中更新文件的缩略图、大小等信息

```java
// 合并文件分片：业务逻辑
@Async
public void transferFile(String fileId, SessionWebUserDto webUserDto) {
    // 设置成功标志
    Boolean transferSuccess = true;
    String targetFilePath = null;
    String cover = null;
    FileTypeEnums fileTypeEnum = null;
    FileInfo fileInfo = fileInfoMapper.selectByFileIdAndUserId(fileId, webUserDto.getUserId());
    try {
        if (fileInfo == null || !FileStatusEnums.TRANSFER.getStatus().equals(fileInfo.getStatus())) {
            return;
        }
        // 获取临时目录
        String tempFolderName = appConfig.getProjectFolder() + Constants.FILE_FOLDER_TEMP;
        String currentUserFolderName = webUserDto.getUserId() + fileId;
        File fileFolder = new File(tempFolderName + currentUserFolderName);
        if (!fileFolder.exists()) {
            fileFolder.mkdirs();
        }
        //文件后缀
        String fileSuffix = StringTools.getFileSuffix(fileInfo.getFileName());
        String month = DateUtil.format(fileInfo.getCreateTime(), DateTimePatternEnum.YYYYMM.getPattern());
        //目标目录
        String targetFolderName = appConfig.getProjectFolder() + Constants.FILE_FOLDER_FILE;
        File targetFolder = new File(targetFolderName + "/" + month);
        if (!targetFolder.exists()) {
            targetFolder.mkdirs();
        }
        //真实文件名
        String realFileName = currentUserFolderName + fileSuffix;
        //真实文件路径
        targetFilePath = targetFolder.getPath() + "/" + realFileName;
        //合并文件
        union(fileFolder.getPath(), targetFilePath, fileInfo.getFileName(), true);

        //视频文件切割  FileTypeEnums：文件类型枚举类
        fileTypeEnum = FileTypeEnums.getFileTypeBySuffix(fileSuffix);
        if (FileTypeEnums.VIDEO == fileTypeEnum) {
            cutFile4Video(fileId, targetFilePath);
            //视频生成缩略图
            cover = month + "/" + currentUserFolderName + Constants.IMAGE_PNG_SUFFIX;
            String coverPath = targetFolderName + "/" + cover;
            ScaleFilter.createCover4Video(new File(targetFilePath), Constants.LENGTH_150, new File(coverPath));
        } else if (FileTypeEnums.IMAGE == fileTypeEnum) {
            //生成缩略图
            cover = month + "/" + realFileName.replace(".", "_.");
            String coverPath = targetFolderName + "/" + cover;
            Boolean created = ScaleFilter.createThumbnailWidthFFmpeg(new File(targetFilePath), Constants.LENGTH_150, new File(coverPath), false);
            if (!created) {
                FileUtils.copyFile(new File(targetFilePath), new File(coverPath));
            }
        }
    } catch (Exception e) {
        logger.error("文件转码失败，文件Id:{},userId:{}", fileId, webUserDto.getUserId(), e);
        transferSuccess = false;
    } finally {
        FileInfo updateInfo = new FileInfo();
        updateInfo.setFileSize(new File(targetFilePath).length());
        updateInfo.setFileCover(cover);
        updateInfo.setStatus(transferSuccess ? FileStatusEnums.USING.getStatus() : FileStatusEnums.TRANSFER_FAIL.getStatus());
        fileInfoMapper.updateFileStatusWithOldStatus(fileId, webUserDto.getUserId(), updateInfo, FileStatusEnums.TRANSFER.getStatus());
    }
}
```

合并文件 具体实现：

参数解析：dirPath：用户临时目录，toFilePath：目标全路径(包括文件名)，fileName：文件名，delSource：删除临时目录

```java
// 合并文件分片：具体实现
public static void union(String dirPath, String toFilePath, String fileName, boolean delSource) throws BusinessException {
    File dir = new File(dirPath);
    if (!dir.exists()) {
        throw new BusinessException("目录不存在");
    }
    File fileList[] = dir.listFiles();
    File targetFile = new File(toFilePath);
    RandomAccessFile writeFile = null;
    try {
        // 创建写入文件对象
        writeFile = new RandomAccessFile(targetFile, "rw");
        byte[] b = new byte[1024 * 10];
        for (int i = 0; i < fileList.length; i++) {
            int len = -1;
            //创建读块文件的对象  File.separator：返回不同系统的文件路径分隔符 / || \
            File chunkFile = new File(dirPath + File.separator + i);
            RandomAccessFile readFile = null;
            try {
                readFile = new RandomAccessFile(chunkFile, "r");
                while ((len = readFile.read(b)) != -1) {
                    writeFile.write(b, 0, len);
                }
            } catch (Exception e) {
                logger.error("合并分片失败", e);
                throw new BusinessException("合并文件失败");
            } finally {
                readFile.close();
            }
        }
    } catch (Exception e) {
        logger.error("合并文件:{}失败", fileName, e);
        throw new BusinessException("合并文件" + fileName + "出错了");
    } finally {
        try {
            if (null != writeFile) {
                writeFile.close();
            }
        } catch (IOException e) {
            logger.error("关闭流失败", e);
        }
        if (delSource) {
            if (dir.exists()) {
                try {
                    FileUtils.deleteDirectory(dir);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

