<div>
  <span />
  <span><slot /></span>
</div>

<style>
  div > span:nth-child(2) {
    padding-left: var(--s-2);
  }

  div > span:first-child::before {
    content: "💥";
  }
</style>
