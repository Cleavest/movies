package gr.cleavest.webfluxfilmsdb.mapper;

import gr.cleavest.webfluxfilmsdb.dto.UserDTO;
import gr.cleavest.webfluxfilmsdb.entity.UserEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.springframework.security.core.Authentication;

/**
 * @author Cleavest on 20/10/2024
 */

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDTO map(UserEntity userEntity);

    @InheritInverseConfiguration
    UserEntity map(UserDTO userDTO);
}
