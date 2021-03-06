import { get, post } from './http'

export const loginT = p => post('/User/Login', p)

export const getMenu = () => get('/getMenu')

export const userdata = () => get('/getUserData')

export const GetUserInfo = () => get('/User/GetUserInfo')

export const AddEq = p => post('/Equipment/AddEqAsync', p)

export const GetNotify = p => get('/GetNotify', p)

export const GetEq = () => get('/Equipment/QueryEq')

export const DelEq = p => get('/Equipment/DelEq', p)

export const GetNotifyByName = p => get('/GetNotifyByName', p)

export const CreatClass = p => get('/CreatClass', p)

export const QueryClass = () => get('/QueryClass')

export const GetClassName = p => get('/QueryClassByGradeName', p)

export const AddStudent = p => post('/WebSocket/AddStudentAsync', p)

export const GetStudent = p => get('/Student/GetStudentArr', p)

export const DelStudentBatch = p => post('/Student/BatchDelete', p) //批量删除学生

export const AddTeacher = p => post('/WebSocket/AddTeacherAsync', p)

export const DeletTeacher = p => post('/Teacher/BatchDelete', p)

export const GetTeacher = p => get('/Teacher/GetTeacherArr', p)

export const GetMenu = p => get('/User/GetMenu', p)

export const GetSchoolSelect = p => get('/Options/GetSchool', p)

export const GetNotifyByEcharts = p => get('/Echarts/GetNotify', p)

export const GetAttendanceByEcharts = p => get('/Echarts/GetAttendanceState', p)

export const EditTeacher = p => post('/Teacher/EditTeacherAsync', p)

export const SetTime = p => get('/Attendance/SetTime', p)

export const EditStudent = p => post('/Student/EditStudentrAsync', p)

export const EditUser = p => get('/User/UpdatePwdAsync', p)


export const GetTime = p => get('/Attendance/GetTime', p)


export const DeleteTime = p => get('/Attendance/DelTime', p)

export const GetAllNotify = p => get('/GetAllNotify',p)