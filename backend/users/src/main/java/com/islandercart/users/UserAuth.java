package com.islandercart.users;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAuth {
	private String name;
    private String email;
    private String password;
}
