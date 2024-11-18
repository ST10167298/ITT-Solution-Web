import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class UserManagerTest {
    private UserManager userManager;

    @BeforeEach
    public void setup() {
        userManager = new UserManager();
    }

    @Test
    public void testCreateUser() {
        boolean result = userManager.createUser("test@example.com", "password123", "ID001", "John", "Doe");
        assertTrue(result);

        Map<String, String> user = userManager.getUserData("test@example.com");
        assertNotNull(user);
        assertEquals("John", user.get("firstName"));
        assertEquals("Doe", user.get("lastName"));
        assertEquals("test@example.com", user.get("email"));
    }

    @Test
    public void testCreateUserWithInvalidData() {
        boolean result = userManager.createUser(null, "password123", "ID001", "John", "Doe");
        assertFalse(result);
    }

    @Test
    public void testSignInWithValidCredentials() {
        userManager.createUser("test@example.com", "password123", "ID001", "John", "Doe");

        boolean result = userManager.signIn("test@example.com", "password123");
        assertTrue(result);
    }

    @Test
    public void testSignInWithInvalidPassword() {
        userManager.createUser("test@example.com", "password123", "ID001", "John", "Doe");

        boolean result = userManager.signIn("test@example.com", "wrongPassword");
        assertFalse(result);
    }

    @Test
    public void testSignInWithNonExistentUser() {
        boolean result = userManager.signIn("nonexistent@example.com", "password123");
        assertFalse(result);
    }

    @Test
    public void testLogout() {
        userManager.createUser("test@example.com", "password123", "ID001", "John", "Doe");
        boolean result = userManager.logout("test@example.com");
        assertTrue(result);
    }
}
