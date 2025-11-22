import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
	async getItem(key: string): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(key);
		} catch (error) {
			console.error("Error getting item from storage:", error);
			return null;
		}
	},

	async setItem(key: string, value: string): Promise<void> {
		try {
			await AsyncStorage.setItem(key, value);
		} catch (error) {
			console.error("Error setting item in storage:", error);
		}
	},

	async removeItem(key: string): Promise<void> {
		try {
			await AsyncStorage.removeItem(key);
		} catch (error) {
			console.error("Error removing item from storage:", error);
		}
	},
};
