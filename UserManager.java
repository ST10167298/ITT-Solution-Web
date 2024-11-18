import java.util.HashMap;
import java.util.Map;

public class UserManager {
    private Map<String, Map<String, String>> usersDatabase = new HashMap<>();

    // Method to create a user
    public boolean createUser(String email, String password, String idNumb, String firstName, String lastName) {
        if (email == null || password == null || idNumb == null || firstName == null || lastName == null) {
            return false;
        }
        
        Map<String, String> userData = new HashMap<>();
        userData.put("IDNumb", idNumb);
        userData.put("firstName", firstName);
        userData.put("lastName", lastName);
        userData.put("email", email);
        userData.put("password", password);
        
        usersDatabase.put(email, userData);
        return true;
    }

    // Method to retrieve user data
    public Map<String, String> getUserData(String email) {
        return usersDatabase.get(email);
    }

    // Method to sign in
    public boolean signIn(String email, String password) {
        Map<String, String> userData = usersDatabase.get(email);
        return userData != null && userData.get("password").equals(password);
    }

    // Method to log out
    public boolean logout(String email) {
        // For simplicity, this method doesn't do anything in this example.
        return true;
    }
}
