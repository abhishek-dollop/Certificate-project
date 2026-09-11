import { Routes, Route } from "react-router-dom"
import StudentForm from "../Pages/studentForm"
import Certificate from "../Pages/certificate"

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentForm />} />
      <Route path="/certificate" element={<Certificate />}/>
    </Routes>
  )
}

export default AllRoutes
