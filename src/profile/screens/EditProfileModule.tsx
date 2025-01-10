import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import {
  updatePassword,
  updateEmail,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Authentication, DataBase } from "@/FirebaseConfig";
import { UserContext, UserContextType } from "@/src/login/UserContext";

const { width } = Dimensions.get("window");

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ visible, onClose }: EditProfileModalProps) => {
  const { user, setUser, saveUserToStorage } = useContext(
    UserContext
  ) as UserContextType;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReauth, setShowReauth] = useState(false);

  const handleReauthenticate = async () => {
    if (!user || !currentPassword) return;

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error: any) {
      Alert.alert("Error", "Current password is incorrect");
      return false;
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const hasChanges =
      displayName !== user.displayName ||
      email !== user.email ||
      password.length > 0;

    if (!hasChanges) {
      Alert.alert("No Changes", "No changes were made to your profile");
      return;
    }

    setShowReauth(true);
  };

  const handleSaveWithReauth = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log(currentPassword);
      const reauthed = await handleReauthenticate();
      if (!reauthed) {
        setLoading(false);
        return;
      }

      if (email !== user.email) {
        await updateEmail(user, email);
        saveUserToStorage(user);
      }

      if (password) {
        if (password !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          return;
        }
        if (password.length < 6) {
          Alert.alert("Error", "Password should be at least 6 characters");
          return;
        }
        await updatePassword(user, password);
        saveUserToStorage(user);
      }

      if (displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: displayName,
        });
        saveUserToStorage(user);
      }

      Alert.alert("Success", "Profile updated successfully");
      setShowReauth(false);
      onClose();

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderReauthenticationForm = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Verify Current Password</Text>
      <Text style={styles.description}>
        For security reasons, please enter your current password to make these
        changes.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setShowReauth(false);
            setCurrentPassword("");
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSaveWithReauth}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEditForm = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="New Password (optional)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {showReauth ? renderReauthenticationForm() : renderEditForm()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  saveButton: {
    backgroundColor: "#A61515",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileModal;
