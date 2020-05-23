import Vue from 'vue'
import {
  Message, Button, Form, Input, FormItem, Container, Aside, Main, Header, Menu, Submenu, MenuItem, MenuItemGroup,
  Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox,
  Tag
} from 'element-ui'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
