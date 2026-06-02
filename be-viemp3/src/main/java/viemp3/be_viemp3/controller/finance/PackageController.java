package viemp3.be_viemp3.controller.finance;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.finance.PackageRequest;
import viemp3.be_viemp3.dto.response.finance.PackageResponse;
import viemp3.be_viemp3.service.finance.PackageService;

@RestController
@RequestMapping("${api.vie-mp3-url}/packages")
@RequiredArgsConstructor
public class PackageController {

    private final PackageService packageService;

    // ===== CREATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PostMapping
    public ResponseEntity<ApiResponse<PackageResponse>> createPackage(@RequestBody PackageRequest request) {
        PackageResponse response = packageService.createPackage(request);
        return ResponseEntity.ok(
                ApiResponse.<PackageResponse>builder()
                        .success(true)
                        .message("Tạo gói cước mới thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== UPDATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PutMapping("/{packageId}")
    public ResponseEntity<ApiResponse<PackageResponse>> updatePackage(
            @PathVariable String packageId,
            @RequestBody PackageRequest request) {
        PackageResponse response = packageService.updatePackage(packageId, request);
        return ResponseEntity.ok(
                ApiResponse.<PackageResponse>builder()
                        .success(true)
                        .message("Cập nhật gói cước thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== DELETE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @DeleteMapping("/{packageId}")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable String packageId) {
        packageService.deletePackage(packageId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Xóa gói cước thành công")
                        .build()
        );
    }
}
