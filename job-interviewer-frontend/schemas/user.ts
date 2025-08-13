import axios from "axios";
import * as z from "zod"; 
 
export const User = z.object({ 
  name: z.string().min(1, "Убедитесь, что имя пользоватя заполнено!"),
  password: z.string().min(8, "Длина пароля должна быть как минимум 8 символов!"),
  repeatPassword: z.string()
}).check(async (ctx) => {
  const user = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/user/findOneByName`, {
    params: {username: ctx.value.name}
  })
  const userExists = user.data ? true : false

  if (userExists) {
    ctx.issues.push({
      code: "custom",
      message: "Пользователь с таким именем уже существует!",
      input: ctx.value
    })
  }

  if (ctx.value.password !== ctx.value.repeatPassword) {
    ctx.issues.push({
      code: "custom",
      message: "Пароли должны совпадть!",
      input: ctx.value
    })
  }
});