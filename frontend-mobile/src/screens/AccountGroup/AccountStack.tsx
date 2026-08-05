import { JSX } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AccountStackParamList } from "../../types/navigation";
import { useAuth } from "../../contexts/AuthContext.tsx";

import LoginScreen from "./LoginScreen.tsx";
import ProfileScreen from "./ProfileScreen.tsx";
import OrderHistoryScreen from "./OrderHistoryScreen.tsx";
import RegisterScreen from "./RegisterScreen.tsx";

const Stack = createNativeStackNavigator<AccountStackParamList>();

export default function AccountStack(): JSX.Element {
    const { isLoggedIn } = useAuth();

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
        >
            {isLoggedIn ? (
                <>
                    <Stack.Screen
                        name="Profile"
                        component={ProfileScreen}
                    />

                    <Stack.Screen
                        name="OrderHistory"
                        component={OrderHistoryScreen}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}
