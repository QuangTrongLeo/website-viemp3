package viemp3.be_viemp3.controller.auth;

import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.response.auth.RoleResponse;
import viemp3.be_viemp3.service.auth.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.vie-mp3-url}/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        List<RoleResponse> roles = roleService.getAllRoles();
        ApiResponse<List<RoleResponse>> response = ApiResponse.<List<RoleResponse>>builder()
                .success(true)
                .message("Lấy danh sách role thành công")
                .data(roles)
                .build();
        return ResponseEntity.ok(response);
    }
}

