<template>
  <main class="container my-5">
    <div class="col-lg-8 mx-auto">

      <div class="text-center mb-5">
        <i class="bi bi-journal-bookmark-fill text-primary" style="font-size: 80px;"></i>
        <h1 class="fw-bold mt-3">Про EasyWords</h1>
        <p class="lead text-muted">
          Твій простий та зручний помічник для вивчення англійських слів
        </p>
      </div>

      <div class="accordion shadow-sm" id="aboutAccordion">

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
              <strong>Що таке EasyWords?🧐</strong>
            </button>
          </h2>
          <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#aboutAccordion">
            <div class="accordion-body">
              <p><strong>EasyWords</strong> — це сучасний та зручний веб-додаток, розроблений спеціально для ефективного вивчення англійської лексики.</p>
              <p>Наша головна мета відмовитись від паперових нотатків і зберігати всі нові слова в одному місці.</p>
              <p class="mb-3 fw-bold text-dark">Основні можливості:</p>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <i class="bi bi-check-circle-fill text-success me-2"></i> Створення власних карток зі словами
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle-fill text-success me-2"></i> Зручний перегляд та редагування списку
                </li>
                <li class="mb-2">
                  <i class="bi bi-check-circle-fill text-success me-2"></i> Доступ до словника з будь-якого пристрою
                </li>
                <li class="mb-0">
                  <i class="bi bi-check-circle-fill text-success me-2"></i> Простий та інтуїтивно зрозумілий інтерфейс
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
              <strong>Як користуватися?🧩</strong>
            </button>
          </h2>
          <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#aboutAccordion">
            <div class="accordion-body">
              <p class="mb-3">Розпочати навчання дуже просто:</p>
              <ul class="list-unstyled">
                <li class="mb-3">
                  <i class="bi bi-1-circle-fill text-primary me-2"></i>
                  <strong>Авторизація:</strong><br>
                  Створіть акаунт або увійдіть, щоб ваші слова зберігалися в хмарі.
                </li>
                <li class="mb-3">
                  <i class="bi bi-2-circle-fill text-primary me-2"></i>
                  <strong>Пошук та додавання слів:</strong><br>
                  Шукайте вже <strong>збережені слова</strong> через рядок пошуку, або натисніть <span class="badge bg-success"><i class="bi bi-plus-lg"></i> Додати</span>, щоб записати нове слово.
                </li>
                <li class="mb-3">
                  <i class="bi bi-3-circle-fill text-primary me-2"></i>
                  <strong>Регулярність:</strong><br>
                  Заходьте у додаток щодня, переглядайте та тренуйте пам'ять.
                </li>
                <li class="mb-3">
                  <i class="bi bi-4-circle-fill text-primary me-2"></i>
                  <strong>Результат:</strong><br>
                  Вже за місяць Ваш словниковий запас значно зросте!
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
              <strong>Які технології використано?👨🏾‍💻</strong>
            </button>
          </h2>
          <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#aboutAccordion">
            <div class="accordion-body">
              <p>Цей проект розроблено з використанням сучасного стеку веб-технологій за патерном MVC, що забезпечує швидку роботу та надійність.</p>

              <div class="row mt-3">
                <div class="col-md-6 mb-3">
                  <h6 class="fw-bold text-primary">Frontend (Клієнт):</h6>
                  <ul class="list-group list-group-flush small">
                    <li class="list-group-item px-0">
                      <i class="bi bi-triangle-fill text-success me-2"></i>
                      <strong>Vue 3 & Vite</strong> — реактивний фреймворк.
                    </li>
                    <li class="list-group-item px-0">
                      <i class="bi bi-bootstrap-fill text-primary me-2"></i>
                      <strong>Bootstrap 5.3</strong> — UI та адаптивність.
                    </li>
                  </ul>
                </div>

                <div class="col-md-6 mb-3">
                  <h6 class="fw-bold text-primary">Backend (Сервер):</h6>
                  <ul class="list-group list-group-flush small">
                    <li class="list-group-item px-0">
                      <i class="bi bi-hexagon-fill text-success me-2"></i>
                      <strong>Node.js & Express</strong> — API та серверна логіка.
                    </li>
                    <li class="list-group-item px-0">
                      <i class="bi bi-database-fill text-secondary me-2"></i>
                      <strong>SQLite</strong> — реляційна база даних.
                    </li>
                  </ul>
                </div>
              </div>

              <div class="alert alert-light border mt-2 text-center text-muted small">
                Проєкт створено в середовищі <strong>Visual Studio Code</strong> в рамках лабораторної роботи з курсу "Web-дизайн".
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>