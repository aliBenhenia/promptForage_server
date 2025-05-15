import api from "@/lib/api";
import { User } from "@/types/user";
const userService = {
    updateProfile : async(name:string, email:string):Promise<User>=> {
        const response = await api.put('/api/user/profile', { name, email });
        return response.data;
    },
    updatePassword : async(oldPassword:string, newPassword:string):Promise<User>=> {
        const response = await api.put('/api/user/password', { 
           currentPassword: oldPassword, newPassword 
        });
        return response.data;
    },
}

export default userService;