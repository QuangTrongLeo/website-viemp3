package viemp3.be_viemp3.controller.finance;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
