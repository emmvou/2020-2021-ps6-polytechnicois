import { Component, HostBinding, OnInit } from "@angular/core";
import { Quiz } from "../../models/quiz.model";
import { QuizService } from "../../services/quiz.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-play",
    templateUrl: "./play.component.html",
    styleUrls: ["./play.component.scss"]
})
export class PlayComponent implements OnInit
{

    quiz: Quiz;
    public numquestion = 1; //the current question's number
    public firstStage = true;
    public answersDisplayed: string[]; //the current question's answers
    public quizname: string;
    @HostBinding("style.--rating") //Binds the TS variable `quizdifficulty` to the scss variable `--rating`
    public quizdifficulty: number;
    public questionlabel: string;
    public questionCount = 0;
    public correctAnswer = 0;
    public displayedMessage = "Séléctionnez la bonne réponse";
    public quizTermine = false;
    public urlImage: string = null;
    public trainMode: boolean = false;
    public displayedInTrainMode: boolean[] = [];

    constructor(private quizService: QuizService, private route: ActivatedRoute, private router: Router)
    {
    }

    ngOnInit(): void
    {
        this.route.queryParams.subscribe(params =>
        {
            this.trainMode = params.hasOwnProperty("trainmode");
        });
        this.getQuiz();
    }

    /**
     * Loads the quiz into the component and displays
     * the first question
     */
    getQuiz(): void
    {
        const id = +this.route.snapshot.paramMap.get("id");
        this.quizService.getQuizById(id)
            .subscribe(quiz =>
            {
                this.quiz = quiz;
                this.quizname = this.quiz.name;
                this.answersDisplayed = this.quiz.questions[this.numquestion - 1].answers;
                this.quizdifficulty = this.quiz.difficulty;
                this.questionlabel = this.quiz.questions[this.numquestion - 1].label;
                this.questionCount = this.quiz.questions.length;
                this.correctAnswer = this.quiz.questions[this.numquestion - 1].correctAnswer;
                this.urlImage = this.quiz.questions[this.numquestion - 1].image;
                this.updateDisplayedInTrainMode();
            });
    }

    /**
     * Callback function called whenever the user
     * clicks on an answer
     *
     * @param n: the answer's number
     */
    reponseCliquee(n): void
    {
        if (this.quizTermine)
        {
            return;
        }
        this.questionlabel = this.quiz.questions[this.numquestion - 1].label;
        if (this.firstStage)
        {
            if (this.quiz.questions[this.numquestion - 1].correctAnswer == n)
            {
                console.log("Correct");
            }
            else
            {
                console.log("Incorrect");
            }
            this.displayedMessage = "Cliquez sur la bonne réponse";
        }
        else
        {
            this.numquestion++;
            if (this.numquestion > this.questionCount)
            {
                console.log("Quiz termine");
                this.displayedMessage = "Quiz terminé";
                this.quizTermine = true;
                this.numquestion--;
                return;
            }
            this.answersDisplayed = this.quiz.questions[this.numquestion - 1].answers;
            this.questionlabel = this.quiz.questions[this.numquestion - 1].label;
            this.correctAnswer = this.quiz.questions[this.numquestion - 1].correctAnswer;
            this.urlImage = this.quiz.questions[this.numquestion - 1].image;
            this.displayedMessage = "Séléctionnez la bonne réponse";
            this.updateDisplayedInTrainMode();
        }
        this.firstStage = !this.firstStage;
    }

    /**
     * Returns a random floating number
     * between min an max (min inclusive, max exclusive)
     *
     * @param min: minimum value (inclusive)
     * @param max: maximum vale (exclusive)
     */
    public getRandom(min: number, max: number): number
    {
        if (min > max)
        {
            let tmp = min;
            min = max;
            max = tmp;
        }
        return min + Math.round(Math.random() * (max - min));
    }

    public goToTrain(): void
    {
        this.trainMode = true;
        this.numquestion = 1;
        this.quizTermine = false;
        this.getQuiz();
        this.firstStage = true;
        this.displayedMessage = "Selectionnez la bonne reponse";
        this.router.navigate([this.router.url.split("?")[0]], {
            skipLocationChange: false,
            replaceUrl: true,
            queryParams: { "trainmode": true }
        });
    }

    private updateDisplayedInTrainMode(): void
    {
        this.displayedInTrainMode = [];
        for (let i = 0; i < this.questionCount; i++)
        {
            this.displayedInTrainMode.push(i != this.correctAnswer && this.getRandom(0, 1) === 1);
        }
    }

}
