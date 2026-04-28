import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { Alert, Keyboard, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChannelContext } from "stream-chat-expo";
import { COLORS } from "../lib/theme";

const CustomMessageComposer = () => {
  const { channel } = useChannelContext();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      setSending(true);
      await channel?.sendMessage({ text: trimmed });
      setText("");
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Permission access is required to select from gallery");

        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        quality: 0.7,
      });

      if (result.canceled) return;

      const attachment = result.assets[0];
      const fileName = attachment.fileName || (attachment.type === "video" ? "video.mp4" : "image.jpg");
      const mimeType = attachment.mimeType || (attachment.type === "video" ? "video/mp4" : "image/jpeg");

      if (attachment.type === "image") {
        const response = await channel?.sendImage({
          uri: attachment.uri,
          name: fileName,
          type: mimeType,
        } as any);

        if (response?.file) {
          await channel?.sendMessage({
            text: "",
            attachments: [
              {
                type: "image",
                image_url: response.file,
                fallback: fileName,
              },
            ],
          });
        }
      } else if (attachment.type === "video") {
        const response = await channel?.sendFile({
          uri: attachment.uri,
          name: fileName,
          type: mimeType,
        } as any);

        if (response?.file) {
          await channel?.sendMessage({
            text: "",
            attachments: [
              {
                type: "video",
                asset_url: response.file,
                title: fileName,
                mime_type: mimeType,
              },
            ],
          });
        }
      }
    } catch {
      Alert.alert("Error", "Failed to send attachment");
    }
  };

  const openCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Permission access is required to open camera");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

      if (result.canceled) return;

      const attachment = result.assets[0];
      const fileName = attachment.fileName || "cameraPhoto.jpg";
      const type = "image/jpeg";

      const response = await channel?.sendImage({
        uri: attachment.uri,
        name: fileName,
        type,
      } as any);

      if (response?.file) {
        await channel?.sendMessage({
          text: "",
          attachments: [
            {
              type: "image",
              image_url: response.file,
              fallback: fileName,
            },
          ],
        });
      }
    } catch {
      Alert.alert("Error", "Could not capture photo");
    }
  };

  const filePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const attachment = result.assets[0];
      const response = await channel?.sendFile({
        uri: attachment.uri,
        name: attachment.name || "file",
        type: attachment.mimeType || "application/octet-stream",
      } as any);

      if (response?.file) {
        await channel?.sendMessage({
          text: "",
          attachments: [
            {
              type: "file",
              asset_url: response.file,
              title: attachment.name || "file",
              file_size: attachment.size,
              mime_type: attachment.mimeType,
            },
          ],
        });
      }
    } catch {
      Alert.alert("Error", "Failed to send file");
    }
  };

  const handleAttachmentButton = async (action: "gallery" | "camera" | "document") => {
    setAttachmentOpen(false);

    if (action === "gallery") {
      await pickImage();
      return;
    }

    if (action === "camera") {
      await openCamera();
      return;
    }

    await filePicker();
  };

  return (
    <>
      <View className="bg-surface" style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }}>
        <View
          className="mx-3 mb-2 flex-row items-end rounded-2xl border border-border bg-surface-dark px-3 py-2"
          style={{ minHeight: 48 }}
        >
          <TouchableOpacity
            onPress={() => {
              setAttachmentOpen(true);
            }}
            className="mr-2 pb-2"
          >
            <Ionicons name="attach-outline" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={(content) => {
              setText(content);
            }}
            placeholder="Type your message..."
            placeholderTextColor={COLORS.textMuted}
            selectionColor="#6C5CE7"
            keyboardAppearance="dark"
            multiline
            maxLength={4000}
            className="max-h-32 flex-1 px-1 py-2 text-base text-foreground"
          />

          <TouchableOpacity disabled={!text.trim() || sending} onPress={sendMessage} className="ml-2 pb-2">
            <Ionicons name={sending ? "hourglass-outline" : "send"} size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent animationType="fade" visible={attachmentOpen} onRequestClose={() => setAttachmentOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/45" onPress={() => setAttachmentOpen(false)}>
          <Pressable className="rouned-t-3xl border-t border-border bg-surface px-5 pb-7 pt-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-sans-bold text-foreground">Add Attachment</Text>
              <TouchableOpacity onPress={() => setAttachmentOpen(false)}>
                <Ionicons name="close" size={22} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mb-2 flex-row items-center rounded-xl bg-surface-light px-3 py-3"
              onPress={() => void handleAttachmentButton("gallery")}
            >
              <Ionicons name="images-outline" size={20} color={COLORS.primary} />
              <Text className="ml-3 text-white font-sans">Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mb-2 flex-row items-center rounded-xl bg-surface-light px-3 py-3"
              onPress={() => void handleAttachmentButton("camera")}
            >
              <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
              <Text className="ml-3 text-white font-sans">Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mb-2 flex-row items-center rounded-xl bg-surface-light px-3 py-3"
              onPress={() => void handleAttachmentButton("document")}
            >
              <Ionicons name="document-outline" size={20} color={COLORS.primary} />
              <Text className="ml-3 text-white font-sans">Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-2 items-center rounded-xlborder border-border py-3"
              onPress={() => setAttachmentOpen(false)}
            >
              <Text className="text-foreground-subtle">Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default CustomMessageComposer;
