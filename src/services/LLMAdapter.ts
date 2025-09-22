import { AIModel, AnswerDTO } from '../types/Message';

export class LLMAdapter {
  private static predefinedQA = [
    {
      keywords: ['зачем', 'dfs', 'распределённая', 'файловая', 'система'],
      answer: "Чтобы избавиться от монолитного сервера, который сложно обновлять и резервировать. DFS делает систему отказоустойчивой – если один сервер упадёт, пользователи даже не заметят, потому что данные реплицируются на другие серверы.",
      source: {
        title: "Инженерные системы и Hardware.docx",
        url: "https://confluence.company.ru/pages/dfs-systems",
        excerpt: "Предпосылки внедрения распределённых файловых систем",
        accessLevel: 'public' as const
      }
    },
    {
      keywords: ['сервер', 'данные', 'отключен', 'перезапишет', 'актуальность'],
      answer: "Нет, благодаря функции «Актуальность содержимого» сервер, который долго был отключен, не сможет перезаписать свежие данные своими устаревшими. Это защита от случайной потери информации.",
      source: {
        title: "Концепция сервис файлового хранения на базе DFS.docx",
        url: "https://confluence.company.ru/pages/dfs-content-freshness",
        excerpt: "Раздел «Актуальность содержимого» - защита от перезаписи актуальных данных",
        accessLevel: 'public' as const
      }
    },
    {
      keywords: ['ansible', 'зачем', 'автоматизация'],
      answer: "Ansible – это система для автоматизации рутинных задач, например, настройки серверов, раскладки SSH–ключей или обновления ПО. Мы решили его внедрить, чтобы сэкономить время администраторов и уменьшить количество ручной работы.",
      source: {
        title: "Linux СПО.docx",
        url: "https://confluence.company.ru/pages/linux-software",
        excerpt: "Документ от 9 окт. 2023 г. об автоматизации с помощью Ansible",
        accessLevel: 'public' as const
      }
    },
    {
      keywords: ['альтернативы', 'microsoft', 'office', 'visio', 'linux'],
      answer: "Вместо MS Office – LibreOffice (базовый функционал) или OnlyOffice (дизайн как в MS Office, но макросы на JavaScript). Вместо Visio – LibreOffice Draw (базово) или EdrawMax (открывает vsdx–файлы, но частично без перевода).",
      source: {
        title: "Linux СПО.docx",
        url: "https://confluence.company.ru/pages/linux-alternatives",
        excerpt: "Таблица «Альтернативные программные продукты», разделы «Офисный пакет» и «Дополнительный офисный пакет»",
        accessLevel: 'public' as const
      }
    },
    {
      keywords: ['ответственный', 'связь', 'сатурнов', 'jira', 'задачи'],
      answer: "Ответственный – Сатурнов С.С. Все задачи по связи ведутся в специальной доске Jira (уточните название у ответственного). На встречах обсуждаются объекты связи, подходы, инструменты и задействованные сотрудники.",
      source: {
        title: "Связь (телефония, ВОЛС–ы, каналы связи, ТВ, GSM).docx",
        url: "https://confluence.company.ru/pages/communications",
        excerpt: "Шапка документа и протокол от 17 авг. 2023 г.",
        accessLevel: 'public' as const
      }
    }
  ];

  static async generateAnswer(query: string, model: AIModel): Promise<AnswerDTO> {
    // Имитируем задержку обработки
    const delay = 800;
    await new Promise(resolve => setTimeout(resolve, delay));

    const lowerQuery = query.toLowerCase();
    
    // Поиск среди предопределенных вопросов/ответов
    for (const qa of this.predefinedQA) {
      if (qa.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return {
          content: qa.answer,
          confidence: 0.95,
          sources: [qa.source],
          followUpQuestions: []
        };
      }
    }

    // Если вопрос не найден среди предопределенных
    return {
      content: "К сожалению, я не могу ответить на данный вопрос. Попробуйте перефразировать или обратитесь напрямую к техподдержке.",
      confidence: 0.1,
      sources: [{
        title: "Техподдержка РМК",
        url: "https://confluence.company.ru/pages/support",
        excerpt: "Контакты службы технической поддержки",
        accessLevel: 'public' as const
      }],
      followUpQuestions: ["Как связаться с техподдержкой?", "Где найти контакты IT-отдела?"]
    };
  }

  static shouldShowFollowUp(confidence: number): boolean {
    return confidence < 0.7;
  }
}