describe('test', () => {
  beforeEach(() => {
    cy.visit('https://coffee-cart.app/');
  });

  it('Работают ли ссылки в навигации', () => {
    cy.get(':nth-child(1) > a').click(); // Получение тега a с помощью css-селекторов
    cy.url().should('include', '/'); // Сравнение url
    cy.get(':nth-child(2) > a').click();
    cy.url().should('include', '/cart');
    cy.get(':nth-child(3) > a').click();
    cy.url().should('include', '/github');
  });

  it('Меняется ли текст при двойном нажатии на название кофе', () => {
    cy.get(':nth-child(1) > h4')
      .invoke('text') // Извлечь текст
      .then((originalText) => {
        cy.get(':nth-child(1) > h4').dblclick(); // Двойное нажатие

        cy.get(':nth-child(1) > h4')
          .invoke('text')
          .should((newText) => {
            expect(newText).not.to.eq(originalText); // Не должно быть равно
          });
      });
  });

  it('Добавление всех кофе в корзину', () => {
    cy.get('.cup').each(($el) => {
      cy.wrap($el).click(); // Оборачивание элемента в cypress (без этого cypress не сможет определить элемент)
    });
  });

  it('Добавление 1 кофе в корзину и проверка удаления', () => {
    cy.get('.cup').first().click();
    cy.get('a[href="/cart"]').click();
    cy.get('.delete').click();
    cy.get('.router-link-active').should('have.text', 'cart (0)');
  });

  it('Добавление 1 кофе в корзину и проверка появления уведомления', () => {
    cy.get('.cup').first().click(); // Клик на первый попвашейся кофе
    cy.get('a[href="/cart"]').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('#name').type('Мария Лаухина'); // Получение инпута и написание в него текста
    cy.get('#email').type('mari.lauxina@mail.ru');
    cy.get('#submit-payment').click();
    cy.get('.snackbar').should('be.visible');
  });

  it('Добавление 1 кофе в корзину и изменения количества до 2', () => {
    cy.get('.cup').first().click();
    cy.get('a[href="/cart"]').click();
    cy.get(':nth-child(2) > .unit-controller > button[aria-label="Add one Espresso"]').click();
    cy.get(':nth-child(2) > .unit-desc').should('contain', 'x 2');
  });
});
