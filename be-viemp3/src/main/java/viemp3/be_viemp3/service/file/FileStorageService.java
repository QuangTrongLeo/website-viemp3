package viemp3.be_viemp3.service.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String upload(MultipartFile file, String folder);
    void deleteByUrl(String fileUrl);
}
