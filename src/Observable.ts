export interface Observable {
    observe(mutationList: MutationRecord[], observer: MutationObserver): void;
}
