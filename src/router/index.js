import Vue from 'vue'
import Router from 'vue-router'
import Login from "../views/Login";
import Home from "../views/Home";
import Welcome from "../components/Welcome";
import Users from "../components/Users";
import Rights from "../components/Rights";
import Roles from "../components/Roles";
import Goods from "../components/Goods";
import Params from "../components/Params";
import Categories from "../components/Categories";
import Orders from "../components/Orders";
import Reports from "../components/Reports";

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
          { path: '/welcome', component: Welcome},
          { path: '/users', component: Users},
          { path: '/rights', component: Rights},
          { path: '/roles', component: Roles},
          { path: '/goods', component: Goods},
          { path: '/params', component: Params},
          { path: '/categories', component: Categories},
          { path: '/orders', component: Orders},
          { path: '/reports', component: Reports}
          ]
    }
  ],
  mode: 'history'
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从那个路径跳转而来
  // next 是一个函数，表示放行
  //   next() 放行 next（'/login') 强制跳转

  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router