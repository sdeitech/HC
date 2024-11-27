import { Subscription } from "rxjs";

export class SubSinkService {
    private readonly subscriptions: Subscription[] = [];

    set sink(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    unsubscribe() {
        while (this.subscriptions.length > 0) {
            let subscription = this.subscriptions.pop();
            subscription?.unsubscribe();
        }
    }
}