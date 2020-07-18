import home from '../components/home.vue'
import index from '../components/home/index.vue'
import aboutMe from '../components/me/aboutMe.vue'
import equipment from '../components/equipment/equipment.vue' //设备管理
import jinchu from '../components/jinchu/jinchu.vue'
import teacher from '../components/school/teacher.vue'
import student from '../components/school/student.vue'
import classAndGrade from '../components/school/classAndGrade.vue'
import huizong from '../components/quanxianye/quanxianye'
import attendances from '../components/school/attendances.vue'
export const L1Router = [
  {
    path: '/home',
    component: home,
    children: [
      { path: '/home', component: index, alias: '/home' },
      { path: '/notify', component: jinchu },
      { path: '/equiment', component: equipment },
      { path: '/teacherMan', component: teacher },
      { path: '/studentMan', component: student },
      { path: '/classGradeMan', component: classAndGrade },
      { path: '/attendances', component: attendances },
      { path: '/aboutMe', component: aboutMe }
  
    ]
  }
]

export const L23Router = [
  {
    path: '/home',
    component: home,
    children: [
      { path: '/home', component: index, alias: '/home' },
      { path: '/all-notify', component: huizong },
      { path: '/aboutMe', component: aboutMe }
    ]
  }
]
