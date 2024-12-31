package gr.cleavest.webfluxfilmsdb.entity;

import lombok.*;
import org.springframework.aot.generate.Generated;
import org.springframework.aot.generate.GeneratedClass;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

/**
 * @author Cleavest on 20/10/2024
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table("users")
public class UserEntity {

    @Id
    private Long id;
    private String username;
    private String email;
    private String password;
    private LocalDateTime createdAt;

    @ToString.Include(name = "password")
    private String maskPassword(){
        return "********";
    }
}
