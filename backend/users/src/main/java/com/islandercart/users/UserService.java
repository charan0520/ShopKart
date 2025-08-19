package com.islandercart.users;
import java.util.List;

import org.springframework.http.ResponseEntity;

public interface UserService {
    UserDTO createUser(UserAuth userDTO);
    UserDTO getUserById(String id);
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllUsers();
    void deleteUser(String id);
	ResponseEntity<UserDTO> authenticate(UserAuth user);
	String updateUser(String id, UserAuth updatedUser);
}
