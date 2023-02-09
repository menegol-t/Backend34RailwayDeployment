export const checkLogIn = (req: any, res: any, next: any) => {   
  if (!req.isAuthenticated()){
    return res.redirect("/api/login") 
  }
  next()
}