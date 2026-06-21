package viemp3.be_viemp3.service.auth;

import viemp3.be_viemp3.dto.response.auth.RoleResponse;
import viemp3.be_viemp3.entity.Role;
import viemp3.be_viemp3.enums.RoleEnum;
import viemp3.be_viemp3.mapper.auth.RoleMapper;
import viemp3.be_viemp3.repository.auth.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public List<RoleResponse> getAllRoles() {
        return RoleMapper.toResponseList(roleRepository.findAll());
    }

    public Set<RoleEnum> normalizeRoles(Set<RoleEnum> requestedRoles) {
        Set<RoleEnum> finalRoles = new HashSet<>();
        // USER luôn tồn tại
        finalRoles.add(RoleEnum.USER);
        if (requestedRoles == null) {
            return finalRoles;
        }
        if (requestedRoles.contains(RoleEnum.ADMIN)) {
            finalRoles.add(RoleEnum.MOD);
            finalRoles.add(RoleEnum.ADMIN);
        }
        if (requestedRoles.contains(RoleEnum.MOD)) {
            finalRoles.add(RoleEnum.MOD);
        }
        if (requestedRoles.contains(RoleEnum.PREMIUM)) {
            finalRoles.add(RoleEnum.PREMIUM);
        }
        return finalRoles;
    }

    public Set<Role> getRolesFromEnums(Set<RoleEnum> roleEnums) {
        return roleEnums.stream()
                .map(roleEnum -> roleRepository.findByName(roleEnum)
                        .orElseThrow(() ->
                                new RuntimeException("Role not found: " + roleEnum)))
                .collect(Collectors.toSet());
    }
}

