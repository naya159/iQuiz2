var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var angular2_1 = require('angular2/angular2');
var http_1 = require('angular2/http');
var AppComponent = (function () {
    function AppComponent(http) {
        this.http = http;
        this.answered = false;
        this.title = "loading question...";
        this.options = [];
        this.correctAnswer = false;
        this.working = false;
    }
    AppComponent.prototype.answer = function () {
        return this.correctAnswer ? 'correct' : 'incorrect';
    };
    AppComponent.prototype.nextQuestion = function () {
        var _this = this;
        this.working = true;
        this.answered = false;
        this.title = "loading question...";
        this.options = [];
        this.startTime = new Date();
        var headers = new http_1.Headers();
        headers.append('If-Modified-Since', 'Mon, 27 Mar 1972 00:00:00 GMT');
        this.http.get("/api/trivia", { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (question) {
            _this.options = question.options;
            _this.title = question.title;
            _this.answered = false;
            _this.working = false;
        }, function (err) {
            _this.title = "Oops... something went wrong";
            _this.working = false;
        });
    };
    AppComponent.prototype.sendAnswer = function (option, startTime) {
        var _this = this;
        this.working = true;
        this.endTime = new Date();
        var result = Number(this.endTime) - Number(startTime);
        var answer = { 'questionId': option.questionId, 'optionId': option.id };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('/api/trivia', JSON.stringify(answer), { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (answerIsCorrect) {
            _this.answered = true;
            _this.correctAnswer = (answerIsCorrect === true);
            _this.working = false;
        }, function (err) {
            _this.title = "Oops... something went wrong";
            _this.working = false;
        });
    };
    AppComponent.prototype.afterViewInit = function () {
        this.nextQuestion();
    };
    AppComponent.prototype.function = function () {
        alert(this.example);
    };
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'geekquiz-app',
            viewBindings: [http_1.HTTP_BINDINGS]
        }),
        angular2_1.View({
            directives: [angular2_1.NgFor, angular2_1.NgClass],
            template: "\n        <div class=\"flip-container text-center col-md-12\">\n            <div class=\"back\" [ng-class]=\"{flip: answered, correct: correctAnswer, incorrect:!correctAnswer}\">\n                <p class=\"lead\">{{answer()}}</p>\n                <p>\n                    <button class=\"btn btn-info btn-lg next option\" (click)=\"nextQuestion()\" [disabled]=\"working\">Next Question</button>\n                </p>\n            </div>\n            <div class=\"front\" [ng-class]=\"{flip: answered}\">\n                <p class=\"lead\">{{title}}</p>\n                <div class=\"row text-center\">\n                    <button class=\"btn btn-info btn-lg option\" *ng-for=\"#option of options\" (click)=\"sendAnswer(option, startTime)\" [disabled]=\"working\">{{option.title}}</button>\n                </div>\n            </div>\n        </div>\n    "
        }),
        __param(0, angular2_1.Inject(http_1.Http))
    ], AppComponent);
    return AppComponent;
})();
angular2_1.bootstrap(AppComponent);
