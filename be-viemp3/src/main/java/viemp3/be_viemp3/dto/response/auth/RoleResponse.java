package viemp3.be_viemp3.dto.response.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleResponse {
    private String id;
    private String name;
}
