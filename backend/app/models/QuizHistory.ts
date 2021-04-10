import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import Quiz from "./Quiz";
import User from "./User";

@Table
export default class QuizHistory extends Model
{
    @ForeignKey(() => Quiz)
    @Column
    quizId: number;

    @BelongsTo(() => Quiz)
    quiz!: Quiz;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user!: User;

    @Column(DataType.JSON)
    answers: { [id: number]: number };
}
