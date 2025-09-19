import { AnswerDTO, AIModel } from '../types/Message';

export class LLMAdapter {
  private static mockResponses = [
    {
      content: `**Настройка VPN для сотрудников РМК**

1. **Скачайте клиент VPN** с корпоративного портала в разделе "ИТ-сервисы"
2. **Получите учётные данные** у администратора ИТ (заявка через ServiceDesk)  
3. **Установите сертификаты** согласно инструкции в приложении
4. **Проверьте подключение** через тестовый ресурс test.rmk.internal
5. **При проблемах** обратитесь в техподдержку: ext. 2248

*Доступ предоставляется только сотрудникам с соответствующим уровнем допуска.*`,
      confidence: 0.95,
      sources: [
        {
          title: 'Инструкция по настройке VPN',
          url: 'https://confluence.rmk.ru/display/IT/VPN-Setup',
          excerpt: 'Пошаговое руководство по настройке VPN-подключения для удалённой работы...',
          accessLevel: 'public' as const,
        },
        {
          title: 'Политики ИБ - Удалённый доступ',
          url: 'https://confluence.rmk.ru/display/SEC/Remote-Access',
          excerpt: 'Требования безопасности при работе через VPN-соединения...',
          accessLevel: 'restricted' as const,
        },
      ],
      followUpQuestions: [
        'Как получить права администратора?',
        'Что делать если VPN не подключается?',
      ],
    },
    {
      content: `**Оформление отпуска в системе HR**

1. **Войдите в систему** hr.rmk.ru под корпоративными учётными данными
2. **Выберите раздел** "Мой отпуск" → "Подать заявление"
3. **Укажите даты** начала и окончания отпуска
4. **Загрузите документы** (при необходимости - справка, путёвка)
5. **Отправьте на согласование** руководителю
6. **Ожидайте одобрения** в течение 3-5 рабочих дней

*Заявление подаётся не позднее чем за 14 дней до начала отпуска.*`,
      confidence: 0.88,
      sources: [
        {
          title: 'Регламент оформления отпусков',
          url: 'https://confluence.rmk.ru/display/HR/Vacation-Policy',
          excerpt: 'Порядок подачи заявлений на отпуск и необходимые документы...',
          accessLevel: 'public' as const,
        },
      ],
      followUpQuestions: [
        'Как перенести уже одобренный отпуск?',
        'Можно ли взять отпуск авансом?',
      ],
    },
    {
      content: `**Запрос доступа к Confluence**

1. **Создайте заявку** в ServiceDesk (servicedesk.rmk.ru)
2. **Укажите категорию** "Доступы и права" → "Confluence"
3. **Приложите обоснование** - проект или задача, требующая доступа
4. **Получите согласование** от руководителя проекта
5. **Дождитесь обработки** заявки (1-2 рабочих дня)

Для доступа к разделам с ограниченным доступом потребуется дополнительное согласование службы ИБ.`,
      confidence: 0.92,
      sources: [
        {
          title: 'Процедура получения доступов',
          url: 'https://confluence.rmk.ru/display/IT/Access-Request',
          excerpt: 'Стандартная процедура запроса доступа к корпоративным системам...',
          accessLevel: 'public' as const,
        },
        {
          title: 'Матрица доступов Confluence',
          url: 'https://confluence.rmk.ru/display/SEC/Access-Matrix',
          excerpt: 'Уровни доступа и требования для различных разделов Confluence...',
          accessLevel: 'restricted' as const,
        },
      ],
    },
  ];

  static async generateAnswer(query: string, model: AIModel): Promise<AnswerDTO> {
    // Имитация времени ответа в зависимости от модели
    const delay = model === 'fast' ? 500 : 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Выбираем подходящий ответ на основе ключевых слов
    let selectedResponse = this.mockResponses[0]; // По умолчанию VPN

    if (query.toLowerCase().includes('отпуск')) {
      selectedResponse = this.mockResponses[1];
    } else if (query.toLowerCase().includes('confluence') || query.toLowerCase().includes('доступ')) {
      selectedResponse = this.mockResponses[2];
    }

    // Для качественной модели добавляем больше деталей
    if (model === 'quality') {
      selectedResponse = {
        ...selectedResponse,
        confidence: Math.min(selectedResponse.confidence + 0.05, 1),
        content: selectedResponse.content + '\n\n*Ответ сгенерирован качественной моделью с дополнительной проверкой.*'
      };
    }

    return selectedResponse;
  }

  static shouldShowFollowUp(confidence: number): boolean {
    return confidence < 0.7;
  }
}