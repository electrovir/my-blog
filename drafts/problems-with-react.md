-   state updates in React don't propagate to the actual state objects themselves until the next render (you can't use the updated state in the rest of the render function)
-   super easy to accidentally cause an infinite render loop

List how element-vir solves these problems.
