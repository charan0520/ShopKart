package com.islandercart.users;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String id;
    private String name;
    private String email;
    private String role; // e.g., "USER", "ADMIN"
    @JsonIgnore
    private String password;
}
