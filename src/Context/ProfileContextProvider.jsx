import { useContext } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { profileContext } from "./ProfileContext";
import { authContext } from "./AuthContext";

export default function ProfileContextProvider({ children }) {
  const { userToken } = useContext(authContext);

  const getProfile = async () => {
    const { data } = await axios.get(
      "https://route-posts.routemisr.com/users/profile-data",
      { headers: { token: userToken } }
    );
    return data.data.user;
  };

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile", userToken],
    queryFn: getProfile,
    enabled: !!userToken,
  });

  return (
    <profileContext.Provider
      value={{ profile, profileLoading, refetchProfile }}
    >
      {children}
    </profileContext.Provider>
  );
}