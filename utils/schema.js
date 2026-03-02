import { pgTable,serial,text,varchar } from "drizzle-orm/pg-core";

export const MockInterview =pgTable("mock_interview",{
    id:serial("id").primaryKey(),
    jsonMockResp:text("json_mock_resp").notNull(),
    jobPostion:varchar("job_position").notNull(),
    jobDesc:varchar("job_desc").notNull(),
    jobExperience:varchar("job_experience").notNull(),
    createdBy:varchar("created_by").notNull(),
    createdAt:varchar("created_at").notNull(),
    mockId:varchar("mock_id").notNull(),
}
)

export const UserAnswer=pgTable("userAnswer",{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt')
}

)
export const QuizInterview=pgTable("quizinterview",{
     id:serial("id").primaryKey(),
    jsonQuizResp:text("json_mock_resp").notNull(),
    quiztopics:varchar("quiz_topics").notNull(),
    createdBy:varchar("created_by").notNull(),
    createdAt:varchar("created_at").notNull(),
    quizId:varchar("mock_id").notNull(),

})