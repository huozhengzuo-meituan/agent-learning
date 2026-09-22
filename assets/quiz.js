/* Progressive enhancement: the lesson's <details> remains the no-script answer. */
(() => {
  "use strict";

  document.querySelectorAll("form[data-quiz]").forEach((form) => {
    const feedback = form.querySelector("[data-feedback]");
    if (!feedback) return;

    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.setAttribute("aria-atomic", "true");

    const clearFeedback = () => {
      feedback.textContent = "";
      delete feedback.dataset.state;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = form.querySelector('input[type="radio"][name="answer"]:checked');

      if (!selected) {
        feedback.textContent = "请先选择一个答案，再检查。";
        feedback.dataset.state = "unanswered";
        return;
      }

      const correct = selected.value === form.dataset.answer;
      feedback.textContent = correct
        ? form.dataset.correct || "判断正确。请用自己的话解释原因，再展开解析。"
        : form.dataset.incorrect || "再想一想，也可以展开解析核对推理过程。";
      feedback.dataset.state = correct ? "correct" : "incorrect";
    });

    form.addEventListener("change", (event) => {
      if (event.target.matches('input[type="radio"][name="answer"]')) clearFeedback();
    });

    form.addEventListener("reset", clearFeedback);
  });
})();
