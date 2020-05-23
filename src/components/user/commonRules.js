export default {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 12,
      message: '长度在 3 到 12 个字符',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 5,
      max: 20,
      message: '长度在 5 到 20 个字符',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: '邮箱不能为空',
      triangle: 'blur'
    },
    {
      // 自定义的邮箱验证
      validator: (rule, value, callback) => {
        const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        if (reg.test(value)) callback()
        callback(new Error('请输入合法的邮箱'))
      },
      trigger: 'blur'
    }
  ],
  mobile: [
    {
      required: true,
      message: '手机号不能为空',
      triangle: 'blur'
    },
    {
      // 自定义的手机验证
      validator: (rule, value, callback) => {
        const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
        if (reg.test(value)) callback()
        callback(new Error('请输入合法的手机号'))
      },
      triangle: 'blur'
    }
  ]
}
