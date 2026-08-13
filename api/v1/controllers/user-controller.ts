import e, { Request, Response } from 'express';
import md5 from 'md5';
import User from '../models/user.model';
import { generateRandomString } from '../../../helpers/generate';

export const register = async (req: Request, res: Response) => {
  const emailExist = await User.findOne({
    email: req.body.email,
    deleted: false,
  })

  if (emailExist) {
    res.json({
      code: 400,
      message: "email đã tồn tại",
    })
  }else {
    req.body.password = md5(req.body.password);

    req.body.token = generateRandomString(32);
    const user = new User(req.body);
    const data = await user.save();

    const token = data.token;

    res.json({
      code: 200,
      message: "Đăng ký thành công",
      token: token,
    })
  }
}

export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = md5(req.body.password);

  const user = await User.findOne({
    email: email,
    deleted: false,
  })

  if(!user) {
    res.json({
      code: 400,
      message: "email không tồn tại",
    })
    return
  }
  if(password !== user.password) {
    res.json({
      code: 400,
      message: "Mật khẩu không đúng",
    })
    return
  }

  const token = user.token;

  res.json({
    code: 200,
    message: "Đăng nhập thành công",
    token: token,
  })
}

export const detail = async (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: "Chi tiết thông tin người dùng",
    info: req["user"],
  })
}