interface Subscriber {
  update(deltaTime: number): void;
}

class SubscriptionManager {
  private subscribers: Set<Subscriber> = new Set();

  subscribe(subscriber: Subscriber): void {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers.delete(subscriber);
  }

  notifySubscribers(deltaTime: number): void {
    this.subscribers.forEach((subscriber) => subscriber.update(deltaTime));
  }
}
