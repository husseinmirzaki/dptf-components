import {AxiosResponse} from "axios";

type ToDoTask = () => Promise<void>;

export class TaskManager {
    private tasks: Array<ToDoTask> = [];
    private tasksAreRunning = false;

    get hasTask() {
        return this.tasks.length > 0;
    }

    set addTask(task: ToDoTask) {
        this.tasks.push(task);
        this.runTasks();
    }

    private async runTasks() {
        // console.log("this.tasksAreRunning", this.tasksAreRunning);
        if (this.tasksAreRunning) return;
        this.tasksAreRunning = true;
        let lastTask = this.tasks.shift();
        while (lastTask) {
            await lastTask();
            lastTask = this.tasks.shift();
        }
        this.tasksAreRunning = false;
    }
}


export async function sleep(miliseconds = 1000) {
    return new Promise<void>((r) => setTimeout(() => r(), miliseconds));
}