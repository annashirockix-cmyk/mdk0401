# Дополнение к курсу английского: новые материалы без замены существующих

Статус: пакет содержания v1, подготовлен для отдельного согласования и последующего подключения.  
Правило сохранности: существующие лекции, контрольные, банки и ВПР не изменять и не удалять. Все новые материалы получают отдельные идентификаторы и отдельные банки.

## 1. Инвентаризация перед добавлением

Проверены исходники на ветке `feature/english-course-assessment-architecture`:

- `data-english-basic.js`: 16 лекций в 5 тематических блоках (About Myself, Nizhnekamsk, Tatarstan, Ecology, Additional Reading).
- `data-english-technical.js`: 29 лекций в 12 тематических блоках (Materials, Technical Drawing, Machine Tools, Electricity, Electric Circuits, Energy Production, Electronics, Communication, Computers, Automation, Maintenance, Safety).
- `english-assessment-data.js`: 10 существующих контрольных Basic, по 20 заданий в каждой.
- Набор `SEMESTER_TESTS.technical` сейчас строится копированием Basic через `map()`, а не содержит самостоятельные технические задания.
- Старые итоговые экзамены в этом файле пусты; ВПР Basic и Technical обслуживаются отдельно и не должны затрагиваться этим дополнением.

Это инвентаризация содержимого, а не утверждение об официальном распределении лекций по семестрам. Распределение нужно сверить с утверждёнными рабочими программами.

## 2. Новые отдельные банки

| Банк | Назначение | Объём первой версии |
|---|---|---:|
| `EnglishEntryDiagnosticBank` | Входная диагностика школьной базы до начала обучения | 30 объективных заданий + 1 письменное |
| `EnglishTechnicalSemesterBank` | Самостоятельный Technical English, контрольный комплект-пилот | 20 новых заданий |
| `EnglishTechnicalExamVariantsBank` | Будущие новые экзаменационные варианты по курсам 3–5 | Добавлять пакетами после сверки программ |

Ни один новый вопрос не должен получать ID существующего банка. Ключи, правильные ответы, критерии оценивания и эталонные варианты хранятся только на сервере. Клиенту передаются формулировки, варианты ответов и безопасные метаданные.

## 3. Входная диагностика: 30 заданий

Рекомендуемое время: 35–40 минут. Один балл за каждое объективное задание. Письменное задание оценивается отдельно преподавателем и не включается в автоматический балл. Диагностика не снижает семестровую оценку и не использует техническую лексику, которую студент ещё не изучал.

### Grammar (1–12)

1. My sister ___ a college student.  
   A) am  B) is  C) are  D) be

2. We usually ___ breakfast at seven.  
   A) has  B) having  C) have  D) had

3. Look! The children ___ in the garden.  
   A) play  B) plays  C) are playing  D) played

4. I ___ this film yesterday.  
   A) see  B) saw  C) have seen  D) am seeing

5. She has lived here ___ 2022.  
   A) for  B) since  C) during  D) from

6. There ___ two books on the desk.  
   A) is  B) are  C) was  D) be

7. This is ___ interesting story.  
   A) a  B) an  C) the  D) —

8. Peter is ___ than his brother.  
   A) tall  B) tallest  C) taller  D) the taller

9. You ___ use your phone during the test.  
   A) mustn't  B) don't have  C) aren't  D) couldn't to

10. If it rains, we ___ at home.  
    A) stayed  B) stay yesterday  C) will stay  D) would stayed

11. The letter ___ every Monday.  
    A) delivers  B) is delivered  C) delivered  D) is delivering

12. She asked me where I ___.  
    A) live  B) do live  C) lived  D) am live

### Everyday vocabulary and functions (13–18)

13. Choose the closest meaning of “borrow”.  
    A) give something forever  B) take something for a time and return it  C) buy something  D) lose something

14. “I’m looking forward to the weekend” expresses:  
    A) expectation with pleasure  B) an apology  C) disagreement  D) a warning

15. Choose the correct response: “Would you like some tea?”  
    A) Yes, please.  B) I like yesterday.  C) At five o'clock.  D) No, I wouldn't like.

16. Which word does NOT belong?  
    A) Monday  B) Thursday  C) April  D) Sunday

17. Choose the correct phrase for asking the way.  
    A) How long are you?  B) Could you tell me how to get to the station?  C) What time you go?  D) Where you are go?

18. “The shop is opposite the bank” means the shop is:  
    A) inside the bank  B) across from the bank  C) behind the bank  D) far above the bank

### Reading (19–24)

Read the text.

“Emma is a first-year college student. She lives outside the city, so she takes a bus to college. Her lessons start at half past eight. On Tuesdays and Thursdays she stays after classes because she attends a photography club. Last month the club organised an exhibition. Emma displayed three photographs, and one of them received a special prize. She wants to learn more about digital photography.”

19. Emma is in her ___ year at college.  
    A) first  B) second  C) third  D) final

20. How does she get to college?  
    A) by train  B) by bus  C) on foot  D) by bicycle

21. Her lessons begin at:  
    A) 8:00  B) 8:15  C) 8:30  D) 9:30

22. When does she attend the club?  
    A) every day  B) Tuesdays and Thursdays  C) weekends only  D) Mondays

23. How many photographs did she display?  
    A) one  B) two  C) three  D) four

24. What does Emma want to learn?  
    A) cooking  B) digital photography  C) driving  D) history

### Short messages and dialogue comprehension (25–30)

Read the message.

“Hi, Alex! The study group will meet in Room 214 at 3:15 on Friday, not in the library as we planned. Please bring your notes on the last two lessons. We will prepare a short presentation. — Nina”

25. Where will the group meet?  
    A) in the library  B) in Room 214  C) in the hall  D) online

26. When is the meeting?  
    A) Thursday at 3:15  B) Friday at 2:15  C) Friday at 3:15  D) Saturday at 3:15

27. What should Alex bring?  
    A) a laptop only  B) notes on the last two lessons  C) a textbook for another subject  D) photographs

Read the dialogue.

“Receptionist: Good morning. How can I help you?  
Student: I’m here to ask about the English course.  
Receptionist: Classes are on Monday and Wednesday afternoons.  
Student: Do I need to register today?  
Receptionist: No, you can complete the form online by Friday.”

28. Why is the student at reception?  
    A) to ask about an English course  B) to report a lost bag  C) to pay a bill  D) to meet a teacher

29. When are the classes?  
    A) Monday and Wednesday afternoons  B) Tuesday mornings  C) every Friday  D) weekends

30. How can the student register?  
    A) by telephone today  B) in person tomorrow  C) online by Friday  D) after the first lesson

### Письменное задание (ручная проверка)

Write a message (50–70 words) to a new classmate. Introduce yourself, say what you study, describe one interest, and ask one question.  
Оценивание: выполнение всех пунктов — 0–2; понятность и связность — 0–2; грамматика — 0–2; лексика и орфография — 0–2. Максимум 8 баллов. Результат хранить отдельно от автоматического балла.

### Ключ входной диагностики (server-only)

1 B; 2 C; 3 C; 4 B; 5 B; 6 B; 7 B; 8 C; 9 A; 10 C; 11 B; 12 C; 13 B; 14 A; 15 A; 16 C; 17 B; 18 B; 19 A; 20 B; 21 C; 22 B; 23 C; 24 B; 25 B; 26 C; 27 B; 28 A; 29 A; 30 C.

## 4. Новый пилотный комплект Technical English (20 заданий)

Назначение: отдельный новый комплект по производственной коммуникации и инженерным процессам. Он не заменяет имеющиеся контрольные и не должен автоматически подменять их в интерфейсе.

1. Before a component is assembled, its dimensions should be ___ against the drawing.  
   A) verified  B) borrowed  C) translated  D) delivered

2. A surface with very small irregularities is described as having low surface ___.  
   A) voltage  B) roughness  C) pressure  D) capacity

3. The purpose of a cutting fluid is to reduce heat and ___.  
   A) friction  B) voltage  C) weight  D) length

4. A maintenance log should contain the date, the fault, the action taken and the ___ used.  
   A) spare parts  B) weather  C) timetable  D) salary

5. If a measured value is outside the specified limits, the part is ___.  
   A) accepted automatically  B) non-conforming  C) fully assembled  D) calibrated

6. Match the term to its function: 1) gasket  2) bearing  3) fuse  4) relay.  
   A) protects a circuit from excessive current  
   B) provides a low-friction support for moving parts  
   C) seals a joint against leakage  
   D) switches a circuit using an electrical signal

7. Choose the correct instruction for a work procedure.  
   A) Loosen the bolts before the power is isolated.  
   B) Isolate the power supply before removing the cover.  
   C) Remove the guard while the machine is running.  
   D) Touch the terminals to check whether they are live.

8. The drawing specifies a hole diameter of 12 H7. The letter-number combination describes a dimensional ___.  
   A) fit/tolerance designation  B) material colour  C) tool sequence  D) surface coating

9. A technician reports: “The motor overheats after twenty minutes under load.” This sentence describes a:  
   A) symptom  B) purchase order  C) delivery note  D) safety sign

10. Choose the best cause-and-effect connector: “The filter was blocked; ___, the airflow decreased.”  
    A) however  B) therefore  C) although  D) meanwhile

11. Put the commissioning steps in a logical order:  
    A) record the results; B) inspect the installation; C) perform the functional test; D) isolate the equipment before inspection.  
    Choose: A) D–B–C–A  B) B–C–D–A  C) C–A–B–D  D) A–D–C–B

12. In a wiring diagram, a normally open contact is shown in its ___ state.  
    A) unenergised/rest state  B) overheated state  C) maximum-load state  D) damaged state

13. “The sensor output is proportional to the input pressure” means that the output changes in a consistent ___ to pressure.  
    A) relationship  B) location  C) container  D) direction only

14. Select the correct passive form: “The operator checks the alignment before each shift.”  
    A) The alignment is checked before each shift.  
    B) The alignment checks before each shift.  
    C) The alignment was check before each shift.  
    D) The operator is checked the alignment.

15. Read the report: “After the belt was tensioned, vibration fell from 6.2 mm/s to 2.1 mm/s. The bearing temperature remained unchanged.” What improved?  
    A) vibration level  B) bearing temperature  C) belt length  D) motor voltage

16. Which unit is used to express electrical power?  
    A) ohm  B) watt  C) ampere-hour  D) pascal

17. A device that converts electrical energy into mechanical motion is an:  
    A) actuator  B) insulator  C) resistor  D) enclosure

18. Choose the most suitable report wording.  
    A) “The machine was kind of noisy.”  
    B) “The machine made a strange thing.”  
    C) “An abnormal noise was detected near the drive-end bearing.”  
    D) “Something happened with the machine.”

19. A spare part is “compatible with” a machine if it:  
    A) can be used with it according to the required specification  
    B) is always cheaper  
    C) has the same colour  
    D) comes from the same country

20. A work order says: “Replace the damaged cable, check insulation resistance, and record the test result.” Which action must be documented?  
    A) the insulation-resistance test result  B) the technician's lunch break  C) the room temperature only  D) the cable's colour only

### Ключ Technical English (server-only)

1 A; 2 B; 3 A; 4 A; 5 B; 6: 1–C, 2–B, 3–A, 4–D; 7 B; 8 A; 9 A; 10 B; 11 A; 12 A; 13 A; 14 A; 15 A; 16 B; 17 A; 18 C; 19 A; 20 A.

## 5. Проверка неповторяемости и качества

Перед импортом каждый новый вопрос проходит проверку:

1. Сравнение нормализованной формулировки с вопросами всех существующих Basic/Technical банков.
2. Сравнение вариантов ответов и правильного ответа, чтобы не считать перефразированный дубль новым заданием.
3. Проверка близких смысловых совпадений вручную: одинаковая тема допустима, одинаковая проверяемая мысль и структура ответа — нет.
4. Уникальный ID с префиксом нового банка; ID старых заданий не переиспользуются.
5. Проверка языка, уровня сложности, однозначности ключа и отсутствия опасных инструкций.
6. Отдельный тест серверной проверки: клиент не получает ключи, критерии ручной проверки или правильные ответы.
7. Перед публикацией — проверка, что старые банки по-прежнему читаются и число старых заданий не уменьшилось.

## 6. Что ещё требуется до включения в портал

- Сверить распределение по курсам и семестрам с утверждёнными рабочими программами.
- Согласовать целевой формат новых экзаменационных вариантов: 15 вариантов на каждый из 10 семестров (150 всего) без замены текущих ВПР Basic/Technical.
- Разработать дополнительные самостоятельные Technical English варианты и расширить пилотный банк; этот документ содержит только первую новую двадцатизадательную подборку.
- Подключить новые банки к существующему серверному механизму после отдельной проверки API и интерфейса.
- Провести тестовую выдачу и проверку ответов на тестовом окружении, не создавая фиктивных попыток в журнале реальных студентов.

**Граница этого изменения:** документ добавляет новый учебный контент и план его безопасного подключения. Он сам по себе не импортирует задания в Google Sheets и не меняет Apps Script, интерфейс портала, существующие контрольные или ВПР.
