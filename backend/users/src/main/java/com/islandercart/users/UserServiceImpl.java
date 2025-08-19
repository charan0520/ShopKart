package com.islandercart.users;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	@Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(UserAuth userDTO) {
    	User exists = userRepository.findByEmail(userDTO.getEmail()).orElse(null);
    	if(exists!=null)
    		return null;
        User user = authToEntity(userDTO);
        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return entityToDTO(savedUser);
    }

    @Override
    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return entityToDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return entityToDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
    
    private User authToEntity(UserAuth user) {
    	return User.builder()
                .id(null)
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    private UserDTO entityToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    private User dtoToEntity(UserDTO userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .name(userDTO.getName())
                .email(userDTO.getEmail())
                .password(userDTO.getPassword())
                .build();
    }

	@Override
	public ResponseEntity<UserDTO> authenticate(UserAuth user) {
		User actual = userRepository.findByEmail(user.getEmail().strip()).orElse(null);
		if(actual == null)
			return null;
    	if (passwordEncoder.matches(user.getPassword(), actual.getPassword()))
    		return new ResponseEntity<UserDTO>(entityToDTO(actual),HttpStatus.OK);
    	return null;
	}
	
	@Override
	public String updateUser(String id, UserAuth updatedUser) {
	    User user = userRepository.findById(id)
	        .orElseThrow(() -> new RuntimeException("User not found"));

	    user.setName(updatedUser.getName());
	    user.setEmail(updatedUser.getEmail());
	    // Handle password updates securely, e.g. hash before saving
	    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
	        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
	    }

	    userRepository.save(user);

	    return "Success";
	}
}
