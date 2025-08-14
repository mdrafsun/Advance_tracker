let observers = [];

class Notification {
  static subscribe(observer) {
    observers.push(observer);
  }

  static unsubscribe(observer) {
    observers = observers.filter(obs => obs !== observer);
  }

  static notify(data) {
    observers.forEach(observer => observer.update(data));
  }
}

export default Notification;
