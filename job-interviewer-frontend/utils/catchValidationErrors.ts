import * as z from "zod"; 

export const catchValidationErrors = (error: any) => {
  if (error instanceof z.ZodError) {
    const validationErrors = []
      for (let i=0; i<error.issues.length; i+=1) {
        validationErrors.push(error.issues[i].message)
      }
    return validationErrors
  } else {
    console.error("Unexpected error:", error);
  }
};
