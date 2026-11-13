/* Browser-listening practice catalogue: Course 4, Semester 2 and Course 5.
 * This page is practice-only. It does not save grades or create exam attempts.
 */
(function () {
  "use strict";
  if (window.EnglishListeningCatalogue) return;

  var activities = [
    {
      id: "en-c04-s01-l01",
      title: "Course 4 · Semester 1 · Lesson 1 — Conductors, Semiconductors and Insulators",
      level: "B1+–B2",
      script: "In an electrical system, materials behave differently when an electric charge is applied. Conductors, such as copper and aluminium, allow current to flow relatively easily. Insulators, such as rubber and many plastics, resist the flow of current and are used to protect conductors. Semiconductors, including silicon, have electrical properties between those of conductors and insulators. Their behaviour can be controlled and they are essential in electronic devices. When discussing aircraft electrical equipment, it is important to distinguish the function of a conductor, an insulator and a semiconductor. This is a general materials lesson, not a procedure for working on aircraft wiring.",
      questions: [
        { prompt: "Which materials allow current to flow relatively easily?", options: ["Conductors", "Insulators", "Ceramics only", "Adhesives"], answerIndex: 0, explanation: "Conductors allow current to flow relatively easily." },
        { prompt: "What is the purpose of an insulator?", options: ["To resist current flow and protect conductors", "To increase current without limit", "To store mechanical energy", "To measure frequency"], answerIndex: 0, explanation: "Insulators resist current flow and provide protection." },
        { prompt: "Which material is a common semiconductor?", options: ["Silicon", "Rubber", "Copper cable", "Dry wood"], answerIndex: 0, explanation: "Silicon is identified as a semiconductor." },
        { prompt: "What is the main topic of the lesson?", options: ["Different electrical properties of materials", "Aircraft navigation procedures", "CNC tool selection", "Network topology"], answerIndex: 0, explanation: "The recording compares conductors, insulators and semiconductors." }
      ]
    },
    {
      id: "en-c04-s01-l02",
      title: "Course 4 · Semester 1 · Lesson 2 — Direct Current, Alternating Current and Units",
      level: "B1+–B2",
      script: "A technician is reading a classroom information sheet about electrical quantities. The sheet explains that direct current flows in one direction, while alternating current changes direction periodically. Voltage is measured in volts, current in amperes and resistance in ohms. Electrical power is measured in watts. Frequency describes how many cycles occur in one second and is measured in hertz. When reading a technical value, always pay attention to the unit as well as the number. A value without a unit may be unclear or misleading. These are basic definitions for language learning, not aircraft electrical limits or test values.",
      questions: [
        { prompt: "How does direct current flow?", options: ["In one direction", "It changes direction periodically", "It has no direction", "Only through air"], answerIndex: 0, explanation: "Direct current flows in one direction." },
        { prompt: "What is the unit of voltage?", options: ["Volt", "Ampere", "Ohm", "Watt"], answerIndex: 0, explanation: "Voltage is measured in volts." },
        { prompt: "What does frequency describe?", options: ["The number of cycles per second", "The amount of resistance", "The length of a cable", "The mass of a component"], answerIndex: 0, explanation: "Frequency is the number of cycles in one second." },
        { prompt: "Why is the unit important?", options: ["A number without a unit may be unclear", "Units are only decorative", "Units replace all measurements", "A unit identifies the operator"], answerIndex: 0, explanation: "The recording warns that values need units to be interpreted." }
      ]
    },
    {
      id: "en-c04-s01-l03",
      title: "Course 4 · Semester 1 · Lesson 3 — Basic Electrical Circuit Components",
      level: "B2",
      script: "A simple electrical circuit contains a source, conductors, a load and often a switch. The source provides electrical energy. Conductors create a path for current. The load converts electrical energy into another form, such as light, heat or mechanical movement. A switch opens or closes the circuit. When the path is complete, the circuit is closed and current can flow. When the path is interrupted, the circuit is open. A fuse is a protective device designed to interrupt a circuit if the current becomes too high. In this classroom example, students identify each component on a simplified diagram. They do not connect or test real equipment.",
      questions: [
        { prompt: "What does the source provide?", options: ["Electrical energy", "A mechanical drawing", "A data backup", "A network address"], answerIndex: 0, explanation: "The source provides electrical energy." },
        { prompt: "What does a load do?", options: ["Converts electrical energy into another form", "Always measures frequency", "Stores document revisions", "Connects computers to a WAN"], answerIndex: 0, explanation: "A load converts electrical energy into another form." },
        { prompt: "When is a circuit closed?", options: ["When the path is complete", "When a conductor is removed", "When the source is missing", "When the diagram is printed"], answerIndex: 0, explanation: "A closed circuit has a complete path." },
        { prompt: "What is the purpose of a fuse?", options: ["To interrupt a circuit if current becomes too high", "To increase voltage indefinitely", "To store energy for months", "To convert light into sound"], answerIndex: 0, explanation: "A fuse is a protective device that interrupts excessive current." }
      ]
    },
    {
      id: "en-c04-s01-l04",
      title: "Course 4 · Semester 1 · Lesson 4 — Series and Parallel Circuits",
      level: "B2",
      script: "An instructor compares two simplified circuit diagrams. In a series circuit, components are connected along one path. If one component interrupts that path, the whole circuit may stop operating. In a parallel circuit, components are connected on separate branches. If one branch is interrupted, current may still flow through the other branches. This is why parallel connections are common in many electrical installations. The instructor asks the students to describe the difference using the words branch, path, current and component. The diagrams are classroom examples. They do not represent a specific aircraft electrical network or provide instructions for modifying a circuit.",
      questions: [
        { prompt: "How many paths are there in a simple series circuit?", options: ["One", "Two", "Three", "No path"], answerIndex: 0, explanation: "A series circuit has one path." },
        { prompt: "What happens if the single path is interrupted?", options: ["The whole circuit may stop operating", "All branches continue independently", "The source changes type", "The voltage unit changes"], answerIndex: 0, explanation: "An interruption in the single path can stop the whole circuit." },
        { prompt: "What is a feature of a parallel circuit?", options: ["It has separate branches", "It has only one path", "It has no load", "It cannot contain a switch"], answerIndex: 0, explanation: "Parallel circuits have separate branches." },
        { prompt: "Which vocabulary is used in the comparison?", options: ["Branch, path, current and component", "Fuselage, wing, tail and cockpit", "Router, node, server and protocol", "Casting, forging, milling and grinding"], answerIndex: 0, explanation: "The instructor asks students to use four circuit terms." }
      ]
    },
    {
      id: "en-c04-s01-l05",
      title: "Course 4 · Semester 1 · Lesson 5 — Conventional Power Plants",
      level: "B1+–B2",
      script: "Conventional power plants generate electricity using different energy sources. In a thermal power station, fuel is used to produce heat. The heat creates steam, and the steam drives a turbine connected to a generator. Hydroelectric power stations use moving water to turn turbines. Nuclear power stations use heat from nuclear reactions to produce steam. Each type of plant has different operating principles, resource requirements and environmental considerations. When comparing energy sources, engineers may discuss efficiency, availability, emissions and cost. The figures in a classroom comparison table are simplified examples and should not be treated as current national energy statistics.",
      questions: [
        { prompt: "What drives a turbine in a thermal power station?", options: ["Steam", "A USB device", "A network signal", "A mouse pointer"], answerIndex: 0, explanation: "Steam drives the turbine in the described thermal plant." },
        { prompt: "What does a hydroelectric power station use?", options: ["Moving water", "A fuel cell only", "A computer fan", "A mobile phone battery"], answerIndex: 0, explanation: "Hydroelectric stations use moving water." },
        { prompt: "Which factors may be compared?", options: ["Efficiency, availability, emissions and cost", "Keyboard layout and screen size", "Document font and page count", "Cable colour and connector shape"], answerIndex: 0, explanation: "The speaker lists four comparison factors." },
        { prompt: "How should classroom figures be treated?", options: ["As simplified examples, not current national statistics", "As official live data", "As operating instructions", "As guaranteed forecasts"], answerIndex: 0, explanation: "The speaker explicitly limits the status of the figures." }
      ]
    },
    {
      id: "en-c04-s01-l06",
      title: "Course 4 · Semester 1 · Lesson 6 — Alternative Energy Sources",
      level: "B1+–B2",
      script: "Alternative energy sources include solar, wind, tidal and geothermal energy. Solar panels convert sunlight into electrical energy. Wind turbines use moving air to drive a generator. Tidal systems use the movement of sea water, while geothermal systems use heat from below the Earth's surface. Some renewable sources depend on weather or local geography, so energy storage and connection to the electricity network may be important. Engineers compare the available resource, environmental impact, reliability and cost. In this listening exercise, a student explains why a combination of energy sources may be useful for a training project. The discussion is conceptual and does not provide a site design.",
      questions: [
        { prompt: "What do solar panels convert?", options: ["Sunlight into electrical energy", "Wind into steam", "Water into plastic", "Sound into mechanical force"], answerIndex: 0, explanation: "Solar panels convert sunlight into electrical energy." },
        { prompt: "What drives a wind turbine?", options: ["Moving air", "Underground heat", "Tidal water only", "A computer program"], answerIndex: 0, explanation: "Moving air drives a wind turbine." },
        { prompt: "Why may energy storage be important?", options: ["Some renewable sources depend on weather or local geography", "All renewable sources are constant", "Storage changes the unit of voltage", "It replaces every generator"], answerIndex: 0, explanation: "Availability may vary with weather and location." },
        { prompt: "What is the status of the discussion?", options: ["A conceptual classroom exercise", "A certified site design", "A live power-grid instruction", "A maintenance authorization"], answerIndex: 0, explanation: "The speaker says it is conceptual and not a site design." }
      ]
    },
    {
      id: "en-c04-s01-l07",
      title: "Course 4 · Semester 1 · Lesson 7 — Inventions in Electronics",
      level: "B2",
      script: "The development of electronics has changed communication, computing, transport and manufacturing. The transistor made it possible to build smaller and more efficient electronic circuits. Integrated circuits placed many electronic components on a small piece of semiconductor material. Microprocessors brought processing functions into compact devices. Later developments in sensors and digital communication allowed systems to collect and exchange more information. These inventions developed through research, testing and improvements in materials and manufacturing. In a short presentation, a student should describe the invention, explain the problem it addressed and give an example of its impact without claiming that one invention changed every industry in the same way.",
      questions: [
        { prompt: "What did the transistor make possible?", options: ["Smaller and more efficient electronic circuits", "The end of all electrical systems", "A replacement for every sensor", "A new type of mechanical turbine"], answerIndex: 0, explanation: "The transistor supported smaller and more efficient circuits." },
        { prompt: "What do integrated circuits contain?", options: ["Many electronic components on a small semiconductor piece", "Only mechanical gears", "A complete power station", "A set of paper instructions"], answerIndex: 0, explanation: "Integrated circuits place many components on a small semiconductor substrate." },
        { prompt: "How did these inventions develop?", options: ["Through research, testing and improvements", "All at the same time", "Without materials research", "Only through advertising"], answerIndex: 0, explanation: "The speaker describes gradual development through research and testing." },
        { prompt: "What should a student avoid?", options: ["Claiming one invention changed every industry in the same way", "Explaining an invention's impact", "Giving an example", "Describing the problem addressed"], answerIndex: 0, explanation: "The speaker cautions against overgeneralization." }
      ]
    },
    {
      id: "en-c04-s01-l08",
      title: "Course 4 · Semester 1 · Lesson 8 — Electronic Circuits and Signal Processing",
      level: "B2",
      script: "Electronic circuits process electrical signals. A resistor limits or controls current in a circuit, a capacitor stores electrical energy in an electric field, and a diode allows current to pass more easily in one direction than the other. Transistors can be used as switches or amplifying devices. Some circuits process analogue signals, which vary continuously. Other circuits process digital signals, which use discrete values. In a simplified sensor example, an analogue signal is converted into digital data so that a computer can process and display it. The example explains general concepts only; it does not describe a particular aircraft circuit.",
      questions: [
        { prompt: "What can a resistor do?", options: ["Limit or control current", "Store a document revision", "Generate radio waves by itself", "Measure distance without a sensor"], answerIndex: 0, explanation: "A resistor can limit or control current." },
        { prompt: "What does a diode do?", options: ["Allows current to pass more easily in one direction", "Stores data permanently", "Converts every signal into sound", "Connects a computer to the internet"], answerIndex: 0, explanation: "The diode is described as conducting more easily in one direction." },
        { prompt: "How do analogue signals vary?", options: ["Continuously", "Only as letters", "Only as fixed text labels", "Not at all"], answerIndex: 0, explanation: "Analogue signals vary continuously." },
        { prompt: "What happens in the sensor example?", options: ["An analogue signal is converted into digital data", "A digital file becomes a turbine", "A resistor becomes a sensor", "A drawing becomes a circuit"], answerIndex: 0, explanation: "The example describes analogue-to-digital conversion." }
      ]
    },
    {
      id: "en-c04-s01-l09",
      title: "Course 4 · Semester 1 · Lesson 9 — Mobile Phones and Wireless Communication",
      level: "B1+–B2",
      script: "A mobile phone is a portable communication device. It can send and receive voice, text and data through a wireless network. The device contains a processor, memory, battery, display, antenna and radio components. A mobile network uses base stations to provide coverage over an area. When a user moves, the network can transfer the connection between cells. Wireless communication is useful, but performance may be affected by signal strength, obstacles, interference and network capacity. In a technical workplace, personal devices must be used according to local information-security rules. Do not photograph or share controlled technical information unless you are authorized to do so.",
      questions: [
        { prompt: "What can a mobile phone send and receive?", options: ["Voice, text and data", "Only printed drawings", "Only electrical current", "Only analogue measurements"], answerIndex: 0, explanation: "The phone sends and receives voice, text and data." },
        { prompt: "What does a mobile network use to provide coverage?", options: ["Base stations", "Circuit fuses", "CNC axes", "Hydraulic pumps"], answerIndex: 0, explanation: "Base stations provide network coverage." },
        { prompt: "What may affect wireless performance?", options: ["Signal strength, obstacles, interference and capacity", "The colour of the device", "The font in a report", "The number of pages in a manual"], answerIndex: 0, explanation: "The speaker lists four factors." },
        { prompt: "What should users follow in a technical workplace?", options: ["Local information-security rules", "Personal preference only", "Unverified online advice", "No restrictions"], answerIndex: 0, explanation: "The speaker stresses local information-security rules." }
      ]
    },
    {
      id: "en-c04-s01-l10",
      title: "Course 4 · Semester 1 · Lesson 10 — Aircraft Electrical Power: Sources and Distribution",
      level: "B2",
      script: "This classroom briefing introduces the vocabulary of aircraft electrical power. An aircraft may have more than one source of electrical energy, and the distribution system supplies different groups of equipment. A technical overview may refer to generators, batteries, buses, converters and protective devices. A bus is a distribution path that supplies electrical power to connected loads. The system description explains how power sources and loads are represented in approved documentation. Different aircraft designs may use different arrangements, so students must not assume that one simplified diagram applies to every aircraft. This lesson teaches terminology and relationships, not how to operate or isolate a real electrical system.",
      questions: [
        { prompt: "What is the focus of the briefing?", options: ["Vocabulary for aircraft electrical power", "A live aircraft power test", "A repair procedure", "A passenger service announcement"], answerIndex: 0, explanation: "The speaker introduces the vocabulary of electrical power systems." },
        { prompt: "What is a bus in this context?", options: ["A distribution path supplying connected loads", "A passenger vehicle", "A battery chemistry", "A network password"], answerIndex: 0, explanation: "A bus is a power distribution path." },
        { prompt: "Why should students avoid assuming one diagram fits every aircraft?", options: ["Aircraft designs may use different arrangements", "All aircraft use identical systems", "Diagrams never contain symbols", "A bus is always a computer"], answerIndex: 0, explanation: "The speaker notes that designs differ." },
        { prompt: "What is the lesson intended to teach?", options: ["Identify terms and describe relationships", "Operate or isolate a real system", "Approve maintenance work", "Select live electrical settings"], answerIndex: 0, explanation: "The lesson is language and conceptual learning only." }
      ]
    },
    {
      id: "en-c04-s01-l11",
      title: "Course 4 · Semester 1 · Lesson 11 — Wiring Diagrams, Connectors, Bonding and Grounding",
      level: "B2",
      script: "A wiring diagram shows how electrical components and connections are represented in a system. It may identify wires, connectors, terminals, reference numbers and symbols. A connector joins conductors and allows a connection to be made or separated in a controlled design. Bonding and grounding are terms used to describe electrical connections intended to manage potential differences and provide defined reference paths. In a technical document, the symbol, wire identification and connector reference must be read together. A training diagram can help students practise describing connections, but it is not a work instruction. Real aircraft wiring tasks require current approved data, appropriate authorization and the organization's procedures.",
      questions: [
        { prompt: "What does a wiring diagram show?", options: ["Representations of components and electrical connections", "A passenger seating plan", "A list of software passwords", "A manufacturing timetable"], answerIndex: 0, explanation: "A wiring diagram represents components and connections." },
        { prompt: "What does a connector do?", options: ["Joins conductors", "Measures temperature", "Stores a program", "Generates mechanical movement"], answerIndex: 0, explanation: "A connector joins conductors." },
        { prompt: "What must be read together?", options: ["Symbol, wire identification and connector reference", "Only the page colour", "Only the document title", "Only the author's name"], answerIndex: 0, explanation: "The briefing names all three pieces of information." },
        { prompt: "What is required for real aircraft wiring tasks?", options: ["Current approved data, authorization and procedures", "A training diagram alone", "An informal online comment", "A guess based on a similar aircraft"], answerIndex: 0, explanation: "The speaker lists approved data, authorization and procedures." }
      ]
    },
    {
      id: "en-c04-s01-l12",
      title: "Course 4 · Semester 1 · Lesson 12 — Electrical Measurements and Describing a Fault",
      level: "B2",
      script: "When describing an electrical measurement, include the quantity, the value, the unit, the source and the conditions stated in the record. For example, a classroom report might say: ‘The training table lists a voltage value of twelve volts for sample point B.’ The report should distinguish the recorded value from an interpretation. If a field is missing or two records disagree, describe the discrepancy and identify what needs confirmation. Do not invent a measurement or diagnose a failed component without sufficient evidence. Clear professional communication helps another person understand what was observed, what remains unknown and what information is required next.",
      questions: [
        { prompt: "What should a measurement description include?", options: ["Quantity, value, unit, source and stated conditions", "Only a number", "Only the student's name", "A suggested repair"], answerIndex: 0, explanation: "The speaker lists five elements for a clear measurement record." },
        { prompt: "What should a report do when records disagree?", options: ["Describe the discrepancy and identify what needs confirmation", "Choose a value at random", "Delete the source", "Invent a new measurement"], answerIndex: 0, explanation: "The discrepancy should be reported without guessing." },
        { prompt: "What should be distinguished?", options: ["The recorded value and the interpretation", "The title and page colour", "The student and teacher", "The date and room number"], answerIndex: 0, explanation: "The speaker separates observation from interpretation." },
        { prompt: "What is the goal of clear professional communication?", options: ["Explain observations, unknowns and required next information", "Hide uncertainty", "Make an unsupported diagnosis", "Replace technical records"], answerIndex: 0, explanation: "The report should make evidence and remaining questions clear." }
      ]
    },
    {
      id: "en-c04-s02-l01",
      title: "Course 4 · Semester 2 · Lesson 1 — Means of Transmission",
      level: "B1+–B2",
      script: "In a technical communication system, information can be transmitted in different ways. A wired connection uses a physical cable. A wireless connection sends information through radio waves or another wireless signal. Fibre-optic communication uses light travelling through a thin glass or plastic fibre. Each method has advantages and limitations. A cable can provide a stable connection, but it may require physical installation. Wireless communication can support mobility, but signal quality may be affected by distance or interference. Fibre optics can carry large amounts of data over long distances. In an aircraft-related training example, engineers may discuss communication links between equipment, but the exact design must always be taken from approved system documentation.",
      questions: [
        { prompt: "What are the three transmission methods mentioned?", options: ["Wired, wireless and fibre-optic", "Digital, mechanical and hydraulic", "Local, national and international", "Manual, automatic and visual"], answerIndex: 0, explanation: "The briefing describes wired, wireless and fibre-optic communication." },
        { prompt: "What does a wired connection use?", options: ["A physical cable", "Only light", "A printed chart", "A mechanical lever"], answerIndex: 0, explanation: "A wired connection uses a physical cable." },
        { prompt: "What may affect wireless signal quality?", options: ["Distance or interference", "The colour of a cable", "The size of a printed manual", "The revision letter"], answerIndex: 0, explanation: "The speaker identifies distance and interference." },
        { prompt: "Where should engineers find exact system design information?", options: ["Approved system documentation", "An informal guess", "A social media post", "An unrelated classroom worksheet"], answerIndex: 0, explanation: "The speaker says exact design information must come from approved documentation." }
      ]
    },
    {
      id: "en-c04-s02-l02",
      title: "Course 4 · Semester 2 · Lesson 2 — Networks and Topologies",
      level: "B1+–B2",
      script: "A computer network connects devices so that they can exchange information. In a star topology, each device is connected to a central point. In a bus topology, devices share a common communication line. In a ring topology, each device is connected to two neighbouring devices, forming a closed path. A mesh topology provides several possible connections between devices. The choice of topology depends on the system requirements, including reliability, cost, complexity and the amount of data. This classroom diagram uses four computers and a central switch to illustrate a star network. It is a simplified learning model, not a description of an aircraft network.",
      questions: [
        { prompt: "What does a computer network allow devices to do?", options: ["Exchange information", "Change their physical size", "Produce electricity", "Measure temperature directly"], answerIndex: 0, explanation: "A network connects devices so they can exchange information." },
        { prompt: "Which topology uses a central point?", options: ["Star", "Ring", "Bus", "Mesh"], answerIndex: 0, explanation: "In a star topology, devices connect to a central point." },
        { prompt: "How are devices connected in a ring topology?", options: ["To two neighbouring devices in a closed path", "Only to one central switch", "To a single shared cable with no branches", "Without any connection"], answerIndex: 0, explanation: "A ring connects each device to two neighbours." },
        { prompt: "Which factors influence topology selection?", options: ["Reliability, cost, complexity and data volume", "Device colour only", "The operator's age", "The room number"], answerIndex: 0, explanation: "The speaker lists system and resource requirements." }
      ]
    },
    {
      id: "en-c04-s02-l03",
      title: "Course 4 · Semester 2 · Lesson 3 — Computer Hardware and Software",
      level: "B1+–B2",
      script: "A computer system consists of hardware and software. Hardware means the physical components, such as the processor, memory, storage devices, keyboard and display. Software is the set of programs and instructions that tell the hardware what to do. The operating system manages the computer's resources and provides an environment for applications. An application is designed for a particular task, such as editing a document or analysing a training dataset. In an engineering office, a workstation may be used to read drawings, review records or prepare reports. The computer itself does not guarantee that the information is correct: users must check the source, version and context of the data.",
      questions: [
        { prompt: "What is hardware?", options: ["The physical components of a computer", "A set of written instructions only", "An internet connection", "A type of network topology"], answerIndex: 0, explanation: "Hardware refers to physical computer components." },
        { prompt: "What does software include?", options: ["Programs and instructions", "Only cables and connectors", "The monitor casing", "A printed circuit board only"], answerIndex: 0, explanation: "Software is the set of programs and instructions." },
        { prompt: "What does an operating system do?", options: ["Manages computer resources", "Manufactures the processor", "Measures electrical current", "Replaces every application"], answerIndex: 0, explanation: "The operating system manages resources and supports applications." },
        { prompt: "What must users check when reviewing data?", options: ["Source, version and context", "Screen brightness only", "Keyboard layout only", "The colour of the computer"], answerIndex: 0, explanation: "The speaker emphasizes checking the source, version and context." }
      ]
    },
    {
      id: "en-c04-s02-l04",
      title: "Course 4 · Semester 2 · Lesson 4 — USB Storage and Types of Computers",
      level: "B1+–B2",
      script: "Computers are designed for different purposes. A desktop computer is usually installed in one place. A laptop is portable and has a built-in screen and keyboard. A tablet is a lightweight mobile device with a touch screen. A server provides services or resources to other computers on a network. Removable storage devices, such as USB flash drives, can be used to transfer files. However, removable media may introduce security risks if its origin is unknown. In this classroom scenario, a student receives a USB drive from an unidentified source. The correct response is not to open files automatically. The student should follow the college's approved procedure and ask the responsible teacher or IT staff for guidance.",
      questions: [
        { prompt: "Which computer is designed to be portable?", options: ["Laptop", "Desktop", "Server rack", "Mainframe cabinet"], answerIndex: 0, explanation: "A laptop is described as portable." },
        { prompt: "What does a server provide?", options: ["Services or resources to other computers", "A touch screen for every user", "A mechanical drive system", "A paper drawing"], answerIndex: 0, explanation: "A server provides network services or resources." },
        { prompt: "What is one risk of removable media?", options: ["Files may come from an unknown or unsafe source", "It always improves network speed", "It cannot store information", "It changes the screen resolution"], answerIndex: 0, explanation: "The speaker warns about removable media from unknown sources." },
        { prompt: "What should the student do with an unidentified USB drive?", options: ["Follow the college procedure and ask responsible staff", "Open every file immediately", "Copy it to a personal device", "Ignore all security rules"], answerIndex: 0, explanation: "The recommended action is to use the approved local procedure." }
      ]
    },
    {
      id: "en-c04-s02-l05",
      title: "Course 4 · Semester 2 · Lesson 5 — The Internet and Technical Information Sources",
      level: "B1+–B2",
      script: "The internet provides access to a large amount of technical information. Engineers and students may use online catalogues, digital libraries, manufacturer websites and educational resources. However, not every page is reliable or current. Before using information, check who published it, when it was updated, what document or product it refers to and whether the source is authoritative for the task. A forum post may help you understand a common question, but it should not replace an approved technical document. In this exercise, two websites give different descriptions of the same training component. The student records both references and checks the supplied course materials before deciding which description is relevant.",
      questions: [
        { prompt: "What sources are mentioned?", options: ["Online catalogues, digital libraries, manufacturer sites and educational resources", "Only private messages", "Only social networks", "Only printed advertisements"], answerIndex: 0, explanation: "The speaker lists several types of online information sources." },
        { prompt: "What should a user check before relying on a webpage?", options: ["Publisher, update date, reference and authority", "Font size only", "Number of pictures only", "The colour of the logo"], answerIndex: 0, explanation: "The briefing lists publisher, date, reference and authority." },
        { prompt: "What should a forum post not replace?", options: ["An approved technical document", "A personal diary", "A timetable", "A classroom seating plan"], answerIndex: 0, explanation: "A forum post is not a substitute for an approved technical document." },
        { prompt: "What does the student do when two websites disagree?", options: ["Records both references and checks course materials", "Chooses the first result automatically", "Deletes both references", "Invents a third description"], answerIndex: 0, explanation: "The student records both sources and checks the course materials." }
      ]
    },
    {
      id: "en-c04-s02-l06",
      title: "Course 4 · Semester 2 · Lesson 6 — Automation and Robotics",
      level: "B2",
      script: "Automation uses control systems to perform tasks with limited direct human intervention. A robot is a programmable machine that can carry out a range of movements or operations. In manufacturing, robots may support material handling, welding, painting or inspection tasks. Automated systems can improve consistency and repeatability, but they also require planning, monitoring and appropriate safeguards. A human operator remains responsible for following the local procedures and responding to abnormal conditions. In our classroom case, a diagram shows a robot arm moving a training part between two marked positions. The diagram illustrates a sequence of programmed actions; it does not provide instructions for operating real equipment.",
      questions: [
        { prompt: "What is automation?", options: ["Using control systems to perform tasks with limited direct intervention", "A method of drawing by hand", "A type of storage device", "A process of translating documents"], answerIndex: 0, explanation: "The speaker defines automation in terms of controlled task execution." },
        { prompt: "Which task may a manufacturing robot perform?", options: ["Material handling", "Writing a personal email", "Approving a document revision", "Teaching a language class"], answerIndex: 0, explanation: "Material handling is one of the listed examples." },
        { prompt: "What do automated systems still require?", options: ["Planning, monitoring and safeguards", "No human oversight", "No documentation", "No maintenance planning"], answerIndex: 0, explanation: "The briefing stresses planning, monitoring and safeguards." },
        { prompt: "What does the classroom diagram illustrate?", options: ["A sequence of programmed robot movements", "A real operating procedure", "An aircraft flight path", "A network security policy"], answerIndex: 0, explanation: "The diagram is a learning model of a programmed sequence." }
      ]
    },
    {
      id: "en-c04-s02-l07",
      title: "Course 4 · Semester 2 · Lesson 7 — Sensors and Measurement Data",
      level: "B2",
      script: "A sensor detects a physical condition and produces a signal that can be used by an electronic system. Different sensors are designed to measure different quantities. A temperature sensor responds to temperature, a pressure sensor measures pressure, and a proximity sensor detects the presence of an object nearby. The signal may be converted into digital data and displayed or stored. When engineers review sensor information, they consider the measurement range, units, timestamp and source. A missing value or an unusual reading should be described carefully. It may require further investigation, but one reading alone does not always identify the cause of a problem.",
      questions: [
        { prompt: "What does a sensor do?", options: ["Detects a physical condition and produces a signal", "Stores every document revision", "Controls all network users", "Creates a technical drawing"], answerIndex: 0, explanation: "A sensor detects a condition and produces a signal." },
        { prompt: "Which sensor detects the presence of a nearby object?", options: ["Proximity sensor", "Temperature sensor", "Pressure sensor", "Light bulb"], answerIndex: 0, explanation: "A proximity sensor detects an object nearby." },
        { prompt: "What should engineers consider when reviewing sensor data?", options: ["Range, units, timestamp and source", "Colour and font only", "The room temperature only", "The computer brand"], answerIndex: 0, explanation: "The speaker lists four important data details." },
        { prompt: "Does one unusual reading always identify the cause?", options: ["Yes", "No"], answerIndex: 1, explanation: "The speaker says one reading alone may not identify the cause." }
      ]
    },
    {
      id: "en-c04-s02-l08",
      title: "Course 4 · Semester 2 · Lesson 8 — Human–Computer Interaction and Input Devices",
      level: "B1+–B2",
      script: "A human–computer interface allows a person to interact with a digital system. Common input devices include a keyboard, mouse, touch screen, scanner and microphone. A mouse usually controls a pointer on the screen. The user can move the pointer, select an item, open a menu or drag an object. In a technical office, an input device may be used to navigate a drawing, enter a search term or review a digital record. Good interface design should make actions clear and reduce the risk of accidental selection. In this classroom task, students compare two interface layouts and explain which one is easier to use and why.",
      questions: [
        { prompt: "What is a human–computer interface?", options: ["A way for a person to interact with a digital system", "A type of aircraft structure", "A material testing method", "A network cable"], answerIndex: 0, explanation: "The interface enables interaction between a person and a digital system." },
        { prompt: "What does a mouse usually control?", options: ["A pointer on the screen", "The room temperature", "The network voltage", "A robot's power supply"], answerIndex: 0, explanation: "A mouse controls a pointer on the screen." },
        { prompt: "Which action can a user perform with a mouse?", options: ["Select an item or open a menu", "Measure pressure directly", "Transmit radio signals", "Change a material's properties"], answerIndex: 0, explanation: "The speaker lists selecting items and opening menus." },
        { prompt: "What should good interface design do?", options: ["Make actions clear and reduce accidental selection", "Hide all controls", "Use as many menus as possible", "Remove user feedback"], answerIndex: 0, explanation: "The speaker describes clarity and reduced accidental selection." }
      ]
    },
    {
      id: "en-c04-s02-l09",
      title: "Course 4 · Semester 2 · Lesson 9 — Avionics Overview: Systems and Information Exchange",
      level: "B1+–B2",
      script: "Let us look at a simplified avionics information chain. First, a sensor provides information about a particular condition. The signal is received by an electronic unit. The processing unit checks the incoming data and prepares information for another part of the system. Depending on the system design, the result may be shown on a display, stored in a record or shared through an approved data interface. Engineers use system descriptions to understand the relationship between inputs, processing and outputs. Remember that this is a classroom model. Real aircraft systems are more complex, and all maintenance or operational work must follow the current approved documentation and the person’s authorization.",
      questions: [
        { prompt: "What is the briefing about?", options: ["A simplified avionics information chain", "A passenger boarding process", "A real aircraft repair", "A CNC machining cycle"], answerIndex: 0, explanation: "The speaker describes a high-level classroom model of information flow." },
        { prompt: "What provides information first?", options: ["A sensor", "A display", "A report", "A printer"], answerIndex: 0, explanation: "The chain begins when a sensor provides information." },
        { prompt: "What does the processing unit do?", options: ["Checks incoming data", "Repairs the sensor", "Approves maintenance", "Changes the aircraft configuration"], answerIndex: 0, explanation: "The processing unit checks incoming data." },
        { prompt: "Where may the result appear?", options: ["On a display or in a record", "Only in a paper manual", "Only in a passenger list", "In a workshop timetable"], answerIndex: 0, explanation: "The result may be displayed, stored or shared through an approved interface." }
      ]
    },
    {
      id: "en-c04-s02-l10",
      title: "Course 4 · Semester 2 · Lesson 10 — Programming Logic, Flowcharts and Algorithms",
      level: "B2",
      script: "Our classroom example checks a data file. First, the program receives the file name and the file format. Next, it checks whether the format is on the approved list for this exercise. If the format is not valid, the program displays an error message and records the result as ‘not accepted’. If the format is valid, the program continues to the next training step. The same check is repeated for each file in the sample list. This is a simple algorithm for learning about sequence, selection and iteration. It is not aircraft software and must not be used as a real avionics program.",
      questions: [
        { prompt: "What does the classroom algorithm check?", options: ["A data file and its format", "An aircraft engine", "A passenger ticket", "A machine tool"], answerIndex: 0, explanation: "The example checks a data file and its format." },
        { prompt: "What happens if the format is invalid?", options: ["An error message is displayed", "The file is automatically approved", "The program deletes all records", "The program skips every check"], answerIndex: 0, explanation: "An invalid format produces an error message and a not-accepted result." },
        { prompt: "What happens when the format is valid?", options: ["The program continues to the next training step", "The program stops permanently", "The file is deleted", "A maintenance task begins"], answerIndex: 0, explanation: "The program continues to the next training step." },
        { prompt: "Which programming concepts does the example illustrate?", options: ["Sequence, selection and iteration", "Encryption, compression and printing", "Drawing, casting and forging", "Heating, cooling and cutting"], answerIndex: 0, explanation: "The script explicitly names sequence, selection and iteration." }
      ]
    },
    {
      id: "en-c04-s02-l11",
      title: "Course 4 · Semester 2 · Lesson 11 — Sensor Data, Validation and Diagnostic Logs",
      level: "B2",
      script: "We have reviewed five lines in the training log. Most records contain a timestamp and a sample value. Record A-03 has a missing value, so it cannot be included in the same comparison without a note. Record A-04 appears twice with the same timestamp and value. This may be a duplicate, but we should check the source file before removing anything. The available information does not prove a sensor fault. In the report, describe the missing field, identify the possible duplicate and state what evidence is still required. Keep observations separate from assumptions.",
      questions: [
        { prompt: "How many lines were reviewed?", options: ["Three", "Four", "Five", "Six"], answerIndex: 2, explanation: "The speaker says five lines were reviewed." },
        { prompt: "Which record has a missing value?", options: ["A-01", "A-02", "A-03", "A-04"], answerIndex: 2, explanation: "Record A-03 has a missing value." },
        { prompt: "What is unusual about A-04?", options: ["It appears twice with the same timestamp and value", "It has no timestamp", "It contains five different values", "It has been approved"], answerIndex: 0, explanation: "A-04 appears twice with the same timestamp and value." },
        { prompt: "Does the information prove a sensor fault?", options: ["Yes", "No"], answerIndex: 1, explanation: "The speaker says the available information does not prove a sensor fault." }
      ]
    },
    {
      id: "en-c04-s02-l12",
      title: "Course 4 · Semester 2 · Lesson 12 — Cybersecurity Vocabulary and Safe Data Handling",
      level: "B2",
      script: "I received an unexpected message that appears to come from a technical support team. It says that my account will be blocked unless I open an attachment and confirm my password. There are several warning signs: the request is urgent, the attachment was not expected, and the message asks for confidential information. I will not open the attachment or reply with my password. I will use the organization’s approved reporting channel and follow the local incident procedure. I will not send the message or any technical records to my personal account. The security team can review the report through the correct process. Follow-up handover: We checked the sample log and found one incomplete record. The document revision is shown in the header, but the source file still needs to be confirmed. We have not identified the cause of the missing field. Please keep the observation separate from any possible explanation. The next student team should compare the source record with the training copy, note the result and update the classroom report. Do not use this exercise as an operational instruction.",
      questions: [
        { prompt: "What does the unexpected message request?", options: ["Opening an attachment and confirming a password", "Booking a training room", "Updating a timetable", "Reading a public notice"], answerIndex: 0, explanation: "The message threatens to block the account unless the user opens an attachment and confirms a password." },
        { prompt: "Which is a warning sign?", options: ["Urgency and an unexpected attachment", "A familiar classroom schedule", "A normal public announcement", "A completed lesson"], answerIndex: 0, explanation: "Urgency and an unexpected attachment are identified as warning signs." },
        { prompt: "What should the recipient do?", options: ["Use the approved reporting channel", "Reply with the password", "Forward records to a personal account", "Open the attachment immediately"], answerIndex: 0, explanation: "The speaker recommends the organization's approved reporting channel." },
        { prompt: "What does the follow-up log review identify?", options: ["One incomplete record", "A confirmed sensor fault", "A completed maintenance task", "A production approval"], answerIndex: 0, explanation: "The handover says one record is incomplete." }
      ]
    },
    {
      id: "en-c05-s01-l01",
      title: "Lesson 1 — Materials in Mechanical Engineering",
      level: "B1+–B2",
      script: "Welcome to the materials briefing. Engineers select materials by considering their properties, cost and intended use. Common groups include metals, polymers, ceramics and composites. Metals can be classified as ferrous or non-ferrous. Steel is an iron-based alloy containing carbon. Aluminium alloys are widely used in the aircraft industry because they can offer a useful combination of properties. Copper is valued for its electrical conductivity, while PVC is commonly used to insulate wires and cables. Ceramics are hard and can provide electrical insulation, but they are often brittle. Composite materials combine two or more constituents to achieve a set of properties. The correct choice always depends on the design requirements and the approved material information.",
      questions: [
        { prompt: "What factors influence material selection?", options: ["Properties, cost and intended use", "Colour and packaging only", "The supplier's location only", "The age of the workshop"], answerIndex: 0, explanation: "The briefing names properties, cost and intended use." },
        { prompt: "What is steel described as?", options: ["An iron-based alloy containing carbon", "A pure non-metal", "A ceramic material", "A polymer"], answerIndex: 0, explanation: "Steel is described as an iron-based alloy containing carbon." },
        { prompt: "Which material is commonly used to insulate wires?", options: ["PVC", "Brass", "Concrete", "Ceramic fibre only"], answerIndex: 0, explanation: "PVC is commonly used to insulate wires and cables." },
        { prompt: "What is a composite material?", options: ["A material combining two or more constituents", "A pure metal", "A type of drawing instrument", "A document revision"], answerIndex: 0, explanation: "The speaker defines composites as combinations of two or more constituents." }
      ]
    },
    {
      id: "en-c05-s01-l02",
      title: "Lesson 2 — Technical Drawing, CAD and CAM",
      level: "B1+–B2",
      script: "A technical drawing communicates the shape and characteristics of a component. It should show accurate dimensions, proportions, symbols and units so that different specialists can understand the same design information. Traditional manual drafting uses tools such as rulers, compasses, set squares and protractors. Computer-aided design, or CAD, allows designers to create and modify digital models. A three-dimensional model can help a team understand how components may fit together. Computer-aided manufacturing, or CAM, uses computer systems to support manufacturing processes. When CAD and CAM are linked, design information can be transferred into a manufacturing workflow. The drawing and model must still be checked against the correct requirements and document revision.",
      questions: [
        { prompt: "What is the main purpose of a technical drawing?", options: ["To communicate a component's characteristics", "To record staff attendance", "To calculate wages", "To replace all written specifications"], answerIndex: 0, explanation: "The briefing says a drawing communicates the shape and characteristics of a component." },
        { prompt: "Which tool is used in manual drafting?", options: ["A protractor", "A soldering iron", "A pressure sensor", "A data logger"], answerIndex: 0, explanation: "A protractor is listed among manual drafting tools." },
        { prompt: "What does CAD stand for?", options: ["Computer-aided design", "Controlled aircraft data", "Computer-assisted diagnosis", "Certified assembly drawing"], answerIndex: 0, explanation: "CAD means computer-aided design." },
        { prompt: "What does CAM support?", options: ["Manufacturing processes", "Passenger booking", "Staff recruitment", "Document translation"], answerIndex: 0, explanation: "CAM supports computer-aided manufacturing processes." }
      ]
    },
    {
      id: "en-c05-s01-l03",
      title: "Lesson 3 — Maintenance Documentation and Technical Manuals",
      level: "B2",
      script: "Before you use this training record, check the document header. The reference number is TRN-QA-014 and the revision is C. Revision B is listed as superseded in this fictional example. The status field says ‘classroom example’, and the applicability field limits the document to a fictional training component. If a revision or applicability statement is unclear, do not guess. Ask the document owner or teacher to confirm which controlled copy is intended for the exercise. In a real organization, follow its approved document-control process.",
      questions: [
        { prompt: "What is the speaker explaining?", options: ["How to check a training document header", "How to repair a component", "How to operate a machine", "How to approve an aircraft"], answerIndex: 0, explanation: "The speaker explains how to check a fictional training record." },
        { prompt: "What is the document reference?", options: ["TRN-QA-014", "TRN-QA-041", "TRN-EL-014", "TRN-QA-104"], answerIndex: 0, explanation: "The reference is TRN-QA-014." },
        { prompt: "Which revision is marked as superseded?", options: ["A", "B", "C", "D"], answerIndex: 1, explanation: "Revision B is listed as superseded." },
        { prompt: "What should a student do if applicability is unclear?", options: ["Guess", "Use the oldest copy", "Ask the document owner or teacher", "Change the revision"], answerIndex: 2, explanation: "The speaker says to ask the responsible document owner or teacher." }
      ]
    },
    {
      id: "en-c05-s01-l04",
      title: "Lesson 4 — Fault Diagnosis: Symptoms, Evidence and Reports",
      level: "B2",
      script: "The reported condition is that a warning message appeared during the classroom simulation. In training log TL-08, revision A, we can see two identical entries. This is an observation from the supplied record. One possible hypothesis is that the entry was duplicated during data handling, but the available evidence does not confirm the cause. The report should identify the time, the source document and the repeated entries. It should also state that the cause remains unresolved. Do not recommend a repair or identify a failed component on the basis of this classroom example.",
      questions: [
        { prompt: "What happened in the classroom simulation?", options: ["A warning message appeared", "A machine stopped permanently", "A component was replaced", "A test was approved"], answerIndex: 0, explanation: "The reported condition is a warning message." },
        { prompt: "What does training log TL-08 contain?", options: ["Two identical entries", "Two different revisions", "A completed repair", "A production approval"], answerIndex: 0, explanation: "The log contains two identical entries." },
        { prompt: "Is the cause confirmed?", options: ["Yes, data handling is confirmed", "No, the cause remains unresolved", "Yes, a component failed", "No, there is no observation"], answerIndex: 1, explanation: "The speaker says the evidence does not confirm the cause." },
        { prompt: "What should the report include?", options: ["An invented repair", "The time, source document and repeated entries", "A component replacement decision", "An operational instruction"], answerIndex: 1, explanation: "The report should identify traceable facts and the unresolved cause." }
      ]
    },
    {
      id: "en-c05-s01-l05",
      title: "Lesson 5 — Electrical Troubleshooting Communication",
      level: "B2",
      script: "Could you give me the document reference for the handover? It is TRN-EL-022, revision B. Let me read that back: TRN-EL-022, revision B. Is that correct? Yes. The classroom record shows a difference between two status descriptions. Has the cause been confirmed? No. We have only recorded the discrepancy. The source information still needs to be reviewed by the responsible teacher. Understood. I will note that the issue remains unresolved and will not make assumptions about the cause. Thank you. Please include the date and the reference in the handover note.",
      questions: [
        { prompt: "What reference is given in the handover?", options: ["TRN-EL-022", "TRN-EL-202", "TRN-QA-022", "TRN-EL-012"], answerIndex: 0, explanation: "The reference is TRN-EL-022." },
        { prompt: "Which revision is mentioned?", options: ["A", "B", "C", "D"], answerIndex: 1, explanation: "The speakers identify revision B." },
        { prompt: "Why does one speaker read the reference back?", options: ["To confirm that it was heard correctly", "To change the revision", "To approve the record", "To identify a fault"], answerIndex: 0, explanation: "Read-back is used to confirm the reference." },
        { prompt: "What is the status of the cause?", options: ["Confirmed", "Unresolved", "Approved", "Closed"], answerIndex: 1, explanation: "The cause has not been confirmed." }
      ]
    },
    {
      id: "en-c05-s01-l06",
      title: "Lesson 6 — Quality Assurance and Non-conformity Reports",
      level: "B2",
      script: "This is a classroom non-conformity example for sample part P-04. The reference is drawing DR-04, revision A. The stated training requirement is that the feature label must be present. The inspection sheet QF-06 shows that the label is missing from the sample record. The report should identify the requirement, the observation and the evidence. No disposition has been assigned in this exercise. The case is for learning how to write a factual report; it does not define a real acceptance criterion or authorize a production decision. Second briefing: The handover concerns training record QA-17. The process sheet is revision B, while the attached classroom summary refers to revision A. This is a document discrepancy. We have not established why the two revisions differ. Please confirm the intended source document with the teacher before continuing the exercise. In the report, identify both references, state that the cause is unknown and keep the original records unchanged.",
      questions: [
        { prompt: "Which sample part is discussed?", options: ["P-04", "P-40", "QF-06", "DR-04"], answerIndex: 0, explanation: "The sample part is P-04." },
        { prompt: "What is missing from the sample record?", options: ["The feature label", "The date", "The drawing title", "The revision letter"], answerIndex: 0, explanation: "The inspection sheet shows that the feature label is missing." },
        { prompt: "Which inspection sheet is mentioned?", options: ["QF-06", "QA-17", "TRN-EL-022", "DR-04"], answerIndex: 0, explanation: "The inspection sheet reference is QF-06." },
        { prompt: "What discrepancy appears in the second briefing?", options: ["Revision B versus revision A", "Two missing part numbers", "A missing date", "A confirmed production defect"], answerIndex: 0, explanation: "The process sheet is B and the summary is A." },
        { prompt: "Has the reason for the revision difference been established?", options: ["Yes", "No"], answerIndex: 1, explanation: "The speaker says the reason has not been established." }
      ]
    },
    {
      id: "en-c05-s01-l07",
      title: "Lesson 7 — Document Revisions and Configuration Control",
      level: "B2",
      script: "Here is the change summary for training document TRN-ENG-031. The previous classroom version was revision C, issued on the fourth of April. The updated classroom version is revision D, issued on the eighteenth of April. The change adds a document-reference field to the training layout. This is a change to the training document, not a statement that an aircraft system has been modified. The change log identifies the two versions. If a related classroom record still shows revision C, note the discrepancy and ask the document owner which version is intended for the exercise. Do not select a version by date alone.",
      questions: [
        { prompt: "Which document is being discussed?", options: ["TRN-ENG-031", "TRN-ENG-013", "TRN-EL-031", "TRN-QA-031"], answerIndex: 0, explanation: "The document reference is TRN-ENG-031." },
        { prompt: "What was the previous revision?", options: ["A", "B", "C", "D"], answerIndex: 2, explanation: "The previous classroom version was revision C." },
        { prompt: "What is the updated revision?", options: ["A", "B", "C", "D"], answerIndex: 3, explanation: "The updated version is revision D." },
        { prompt: "What does the change add?", options: ["A document-reference field", "A new aircraft component", "A maintenance interval", "A production setting"], answerIndex: 0, explanation: "The change adds a reference field to the training layout." }
      ]
    },
    {
      id: "en-c05-s01-l08",
      title: "Lesson 8 — Shift Handover and Technical Correspondence",
      level: "B2",
      script: "This is the handover for training package TP-09. The comparison of the two document headers has been completed. One item remains outstanding: the classroom records refer to revisions C and D of TRN-ENG-031. The intended version has not yet been confirmed. The course tutor is the action owner for this clarification. Please keep the discrepancy visible in the handover note and acknowledge receipt of the message. No operational task or technical approval is being transferred; this is a classroom document-review exercise.",
      questions: [
        { prompt: "What is the training package reference?", options: ["TP-09", "TP-90", "TRN-09", "TP-19"], answerIndex: 0, explanation: "The handover is for TP-09." },
        { prompt: "What remains outstanding?", options: ["Confirmation of the intended document revision", "A physical inspection", "A production approval", "A component delivery"], answerIndex: 0, explanation: "The intended version has not yet been confirmed." },
        { prompt: "Who owns the clarification action?", options: ["The course tutor", "The passenger service manager", "The CNC operator", "The document printer"], answerIndex: 0, explanation: "The course tutor is named as the action owner." },
        { prompt: "What should remain visible in the handover note?", options: ["The discrepancy", "A guessed revision", "A repair decision", "A production release"], answerIndex: 0, explanation: "The discrepancy should remain visible until clarified." }
      ]
    },
    {
      id: "en-c05-s01-l09",
      title: "Lesson 9 — Teamwork Across Engineering Specialisms",
      level: "B2+",
      script: "Let us review the training information pack. The technologist has prepared the process overview, but the material note still needs clarification. The programmer has found that one sample data field uses a different label in the summary. The electrician has identified two different labels in the classroom system glossary; the intended wording is not confirmed. The CNC operator has checked the training drawing and reports that the feature identifier is missing from the example. These are four separate observations, not one confirmed technical fault. We will list each source, keep the questions open and refer them to the relevant document owners. Before closing the meeting, each person will read back their action.",
      questions: [
        { prompt: "How many professional roles contribute observations?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "The technologist, programmer, electrician and CNC operator contribute." },
        { prompt: "What does the programmer identify?", options: ["A different label in a sample data field", "A missing drawing feature", "A material note", "A safety boundary"], answerIndex: 0, explanation: "The programmer reports a different field label." },
        { prompt: "What is missing from the training drawing?", options: ["The feature identifier", "The date", "The revision history", "The material certificate"], answerIndex: 0, explanation: "The CNC operator reports a missing feature identifier." },
        { prompt: "How should the team treat the observations?", options: ["As four separate open observations", "As one confirmed technical fault", "As an approval decision", "As reasons to delete the records"], answerIndex: 0, explanation: "The speaker explicitly distinguishes four observations from one confirmed fault." }
      ]
    },
    {
      id: "en-c05-s01-l10",
      title: "Lesson 10 — Interpreting Drawings, Tables and Trend Charts",
      level: "B2+",
      script: "This chart presents two fictional data series over six weeks. The horizontal axis shows the week number, and the vertical axis shows arbitrary index units. Series A rises from ten units in Week 1 to a peak of fourteen in Week 4. It then falls to twelve in Week 5 before increasing slightly to thirteen. Series B increases more gradually and reaches eleven units in Week 5, then falls to ten. Series A remains above Series B throughout the period. The chart describes the pattern, but it does not explain the cause. The source is a classroom dataset, and the values must not be interpreted as real engineering measurements. Second briefing: The team has completed the first review of the classroom information pack. The document register identifies revision D of TRN-ENG-031 as the updated training version, but one attached summary still refers to revision C. The technologist has supplied the process overview, and the programmer has supplied the sample data dictionary. The data dictionary contains one field label that needs confirmation. The electrician’s glossary and the CNC drawing example are included, but the drawing identifier remains an open question. The team will record each discrepancy, identify the relevant document owner and update the handover note after confirmation.",
      questions: [
        { prompt: "How many weeks are shown in the chart?", options: ["Four", "Five", "Six", "Seven"], answerIndex: 2, explanation: "The chart covers six weeks." },
        { prompt: "When does Series A reach its peak?", options: ["Week 1", "Week 3", "Week 4", "Week 6"], answerIndex: 2, explanation: "Series A reaches fourteen units in Week 4." },
        { prompt: "What happens to Series A in Week 5?", options: ["It rises to sixteen", "It falls to twelve", "It remains at fourteen", "It falls to ten"], answerIndex: 1, explanation: "Series A falls to twelve in Week 5." },
        { prompt: "Does the chart explain the cause of the pattern?", options: ["Yes", "No"], answerIndex: 1, explanation: "The speaker says the chart describes the pattern but does not explain its cause." },
        { prompt: "Which revision is identified as the updated classroom version?", options: ["A", "B", "C", "D"], answerIndex: 3, explanation: "The document register identifies revision D." }
      ]
    },
    {
      id: "en-c05-s01-l11",
      title: "Lesson 11 — Risk Assessment and Safety Reporting",
      level: "B2+",
      script: "I would like to report a concern from the simulated training area. In photograph SAFE-TR-05, the marked boundary is not visible. I cannot confirm from the photograph whether the boundary was missing in the room or simply outside the camera view. I informed the teacher and kept the original image with the classroom record. No risk rating has been assigned in this language exercise. The teacher will review the training setup under the institution’s local safety arrangements. I am reporting what I observed, not making a conclusion about the cause.",
      questions: [
        { prompt: "What is not visible in photograph SAFE-TR-05?", options: ["The marked boundary", "A document title", "A data label", "A revision letter"], answerIndex: 0, explanation: "The marked boundary is not visible in the photograph." },
        { prompt: "Can the speaker confirm why it is not visible?", options: ["Yes, it was removed", "No, it may be outside the camera view", "Yes, the room was empty", "No, the photo is deleted"], answerIndex: 1, explanation: "The speaker cannot distinguish absence from camera framing." },
        { prompt: "Who was informed?", options: ["The teacher", "The document supplier", "The passenger", "The data owner"], answerIndex: 0, explanation: "The speaker informed the teacher." },
        { prompt: "Has a risk rating been assigned?", options: ["Yes", "No"], answerIndex: 1, explanation: "No risk rating is assigned in the language exercise." }
      ]
    },
    {
      id: "en-c05-s01-l12",
      title: "Lesson 12 — Integrated Technical Briefing: From Task to Report",
      level: "B2+",
      script: "Good morning. This briefing summarizes the fictional Training Information Pack Review, reference TP-15. Our objective was to review the clarity and consistency of four classroom documents. We compared their references, labels and sample information. The review identified one process-sheet note that needs clarification and one data field with inconsistent labels. We also found two terms for the same sample concept in the glossary, while the training drawing example does not show its feature identifier. The scope excluded physical inspection, equipment operation, production approval and aircraft maintenance. The source pack contains fictional information only. We recommend recording each finding, assigning a document owner to clarify it and updating the handover after confirmation. No operational status or approval decision has been made. Follow-up: The team has completed the language and document-consistency review for TP-15. The glossary owner has confirmed the preferred classroom term. Two items remain open: the process-sheet note and the missing feature identifier in the training drawing. The technologist and CNC operator will refer those questions to the relevant document owners. The final report will state that the review covered classroom documents only. It did not include physical inspection, equipment operation, production approval or aircraft maintenance.",
      questions: [
        { prompt: "What is the project reference?", options: ["TP-15", "TP-51", "TRN-15", "TP-05"], answerIndex: 0, explanation: "The fictional review is TP-15." },
        { prompt: "How many classroom documents were reviewed?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "The review covered four classroom documents." },
        { prompt: "Which item has a missing identifier?", options: ["The training drawing feature", "The glossary owner", "The process sheet date", "The data dictionary title"], answerIndex: 0, explanation: "The training drawing example lacks its feature identifier." },
        { prompt: "Which activities were excluded?", options: ["Physical inspection, equipment operation, production approval and aircraft maintenance", "Vocabulary review and listening", "Document comparison and reporting", "Glossary clarification"], answerIndex: 0, explanation: "The speaker explicitly lists the excluded operational activities." },
        { prompt: "What remains open after the follow-up?", options: ["The process-sheet note and missing drawing feature identifier", "The glossary term only", "The project reference", "The number of documents"], answerIndex: 0, explanation: "Two items remain open." }
      ]
    },
    {
      id: "en-c05-s02-l01",
      title: "Lesson 1 — Delivering a Technical Presentation",
      level: "B2",
      script: "Good morning, everyone. The purpose of this briefing is to present the results of the fictional Aviation Training Data Review, reference ATD-08. Our audience includes colleagues from four specialisms, so I will explain the terms that may be unfamiliar. The scope is limited to four classroom documents: a sample process sheet, a data dictionary, a wiring-diagram glossary and a CNC drawing extract. We identified an inconsistent term, one missing identifier and two records with incomplete units. The review did not include physical equipment, live production data, aircraft maintenance or operational testing. I will begin by explaining the sources, then present the findings and limitations. After that, I will hand over to the programmer for the data-label example.",
      questions: [
        { prompt: "What is the speaker doing?", options: ["Giving a passenger announcement", "Opening a technical briefing about a fictional information-pack review", "Explaining how to repair an aircraft", "Giving instructions for operating a CNC machine"], answerIndex: 1, explanation: "The speaker opens a briefing about a fictional classroom review." },
        { prompt: "What is the scope?", options: ["A physical inspection of an aircraft", "A production release decision", "A review of four classroom documents", "A live electrical test"], answerIndex: 2, explanation: "The scope is limited to four classroom documents." },
        { prompt: "What is the project reference?", options: ["ATD-08", "ATD-80", "ADB-08", "ATD-18"], answerIndex: 0, explanation: "The project reference is ATD-08." },
        { prompt: "How many classroom documents are included?", options: ["Two", "Three", "Four", "Eight"], answerIndex: 2, explanation: "The briefing lists four classroom documents." },
        { prompt: "Which issue is mentioned?", options: ["A missing passenger record", "An inconsistent term", "A damaged aircraft component", "An unapproved machine setting"], answerIndex: 1, explanation: "One inconsistent term was identified." },
        { prompt: "What is explicitly excluded?", options: ["A review of document labels", "A review of classroom sources", "Physical equipment, live production data, maintenance and operational testing", "A handover to the programmer"], answerIndex: 2, explanation: "The speaker explicitly excludes real equipment and operational activity." }
      ]
    },
    {
      id: "en-c05-s02-l02",
      title: "Lesson 2 — Writing a Structured Technical Report",
      level: "B2",
      script: "Could we review the draft report before it is submitted? The objective and scope are clear, but the source document reference is missing. Please add the reference to the sample data dictionary. I also noticed that the results section says the information system is unreliable. The review only identified one missing label and one inconsistent term in a five-row classroom sample. That evidence does not support a general statement about system reliability. Please separate the observation from the interpretation, describe the sample limitation and list the two items that require clarification. The conclusion should state only what the review established. The document owner can then confirm the preferred labels and update the report history.",
      questions: [
        { prompt: "What are the speakers reviewing?", options: ["A draft classroom technical report", "A real aircraft release certificate", "A staff timetable", "A passenger announcement"], answerIndex: 0, explanation: "They are reviewing a draft classroom report." },
        { prompt: "What is the main problem?", options: ["The report has no title and no pictures", "It makes a conclusion that is broader than the evidence", "It contains too many appendices", "It is written in the wrong language"], answerIndex: 1, explanation: "The claim about system reliability exceeds the small sample evidence." },
        { prompt: "Which reference is missing?", options: ["The source document reference", "The student group number", "The room number", "The printer model"], answerIndex: 0, explanation: "The source document reference is missing." },
        { prompt: "What should be separated?", options: ["The title and date", "The observation and interpretation", "The author and reader", "The table and appendix"], answerIndex: 1, explanation: "The writer should separate the observed finding from its interpretation." },
        { prompt: "What should the writer add?", options: ["An unsupported cause", "A list of passenger names", "The limitations of the review", "A production approval"], answerIndex: 2, explanation: "The report must explain the sample limitation." }
      ]
    },
    {
      id: "en-c05-s02-l03",
      title: "Lesson 3 — Professional Interview and Oral Examination Skills",
      level: "B2",
      script: "Examiner: Why is revision control important in a technical environment? Candidate: Revision control helps a team identify the version of a document being used. It reduces confusion when information is updated. Examiner: Can you give an example? Candidate: Yes. In a fictional classroom case, a drawing extract showed revision C, while a related process sheet referred to revision B. The difference was recorded as an open question. Examiner: Does that prove that one document is incorrect? Candidate: Not by itself. We would need to check the controlled document register and confirm which revision applies to the task. The cause of the mismatch has not been established. Examiner: What would you do next? Candidate: I would record the two references, avoid making an unsupported choice and ask the responsible document owner to confirm the current version. I would then update the handover with the confirmed information.",
      questions: [
        { prompt: "What is the situation?", options: ["A candidate is answering an oral technical question", "A pilot is speaking to passengers", "An operator is starting a production cycle", "A student is ordering lunch"], answerIndex: 0, explanation: "The recording is an examiner-candidate exchange." },
        { prompt: "What is the candidate's main strength?", options: ["The candidate guesses quickly", "The candidate structures the answer and identifies a limitation", "The candidate avoids every question", "The candidate changes the subject"], answerIndex: 1, explanation: "The candidate explains the concept and states what remains unconfirmed." },
        { prompt: "What topic is the examiner asking about?", options: ["Revision control", "Staff holidays", "Aircraft seating", "Food safety"], answerIndex: 0, explanation: "The examiner asks about revision control." },
        { prompt: "What example does the candidate use?", options: ["A fictional mismatch between two document revisions", "A real aircraft repair", "A passenger complaint", "A personal travel story"], answerIndex: 0, explanation: "The candidate describes a fictional revision mismatch." },
        { prompt: "What does the candidate say is not established?", options: ["The document title", "The cause of the mismatch", "The candidate's name", "The classroom number"], answerIndex: 1, explanation: "The cause of the mismatch has not been established." },
        { prompt: "What does the candidate recommend?", options: ["Guess which revision is correct", "Delete the older file", "Record both references and ask the document owner to confirm the current version", "Use either file without checking"], answerIndex: 2, explanation: "The candidate recommends checking the controlled register and confirming the current version." }
      ]
    },
    {
      id: "en-c05-s02-l04",
      title: "Lesson 4 — Reading Specifications, Procedures and Standards",
      level: "B2",
      script: "Student: I found a document extract for our technical report. It is called Training Specification TS-17, revision B. Can I use it as the source? Teacher: First, check its scope and status. The extract says that it is a classroom language exercise. Student: So it can help us practise document vocabulary, but it is not an operational specification? Teacher: Correct. Also, do not assume that revision B is the current controlled version. The exercise only identifies the revision printed on this extract. Student: Should I write that limitation in the report? Teacher: Yes. State that the source is a classroom extract and that its current applicability has not been confirmed. If a real task requires a controlled document, the responsible person must verify the approved source. Student: Understood. I will cite TS-17, revision B, as the supplied classroom extract and keep the limitation clear.",
      questions: [
        { prompt: "What are the speakers discussing?", options: ["Whether a fictional document extract is applicable to a classroom task", "How to repair an aircraft", "How to change a live electrical system", "Which machine should be operated"], answerIndex: 0, explanation: "They discuss the use and limitations of a classroom document extract." },
        { prompt: "What is the main concern?", options: ["The document's title is too long", "The scope and revision need to be checked", "The classroom is too noisy", "The report needs a photograph"], answerIndex: 1, explanation: "The student must verify scope and controlled revision." },
        { prompt: "What is the document reference?", options: ["TS-17", "ST-71", "TS-71", "T5-17"], answerIndex: 0, explanation: "The document is identified as TS-17." },
        { prompt: "Which revision appears in the classroom extract?", options: ["A", "B", "C", "D"], answerIndex: 1, explanation: "The printed revision is B." },
        { prompt: "What does the student need to confirm?", options: ["The document's applicability and current controlled revision", "The colour of the cover", "The author's personal opinion", "The number of pages only"], answerIndex: 0, explanation: "The student must confirm applicability and current controlled status." },
        { prompt: "What should the student do if the source cannot be confirmed?", options: ["Treat the extract as approved", "Guess the current revision", "State the limitation and ask the responsible person to verify the approved source", "Use it for a real maintenance task"], answerIndex: 2, explanation: "The source must remain identified as an unconfirmed classroom extract." }
      ]
    },
    {
      id: "en-c05-s02-l05",
      title: "Lesson 5 — Manufacturing Process Review and Improvement",
      level: "B2",
      script: "The process-document review covered eight fictional training records. The material-identification stage was documented in all eight records, although one source reference needs clarification. Two records use different terms for the same process stage. The handover section contains three records without an identified action owner. This is an observation about the sample; it does not establish why the fields are missing or whether the same issue exists elsewhere. We recommend that the document owner review the handover template and confirm how action ownership should be recorded. Any wider process change would require a separate review by the responsible team.",
      questions: [
        { prompt: "What is the speaker reporting?", options: ["A fictional process-document review", "A confirmed aircraft production defect", "A machine operating procedure", "A passenger service issue"], answerIndex: 0, explanation: "The speaker reviews fictional training records." },
        { prompt: "What is the main finding?", options: ["Every record is incomplete", "Three handover records do not identify an action owner", "The process has been officially approved", "The team changed a real production parameter"], answerIndex: 1, explanation: "Three handover records lack an action owner." },
        { prompt: "How many training records were reviewed?", options: ["Three", "Six", "Eight", "Eighteen"], answerIndex: 2, explanation: "The speaker says eight fictional records were reviewed." },
        { prompt: "How many handover records lack an action owner?", options: ["One", "Two", "Three", "Eight"], answerIndex: 2, explanation: "Three records have no identified action owner." }
      ]
    },
    {
      id: "en-c05-s02-l06",
      title: "Lesson 6 — CNC Program Review and Revision Communication",
      level: "B2",
      script: "I have compared the two files in the CNC training package. Both use the training ID CNC-TR-04, but their names and header revisions need to be read together. File B includes the letter B in its name and shows revision B in the header. However, the change note only says ‘label updated’, and the approval status is not stated. I have recorded the file names, header information and the missing status field in the review note. I have not selected either file for equipment use. The document owner must confirm the intended classroom version and update the change record.",
      questions: [
        { prompt: "What is the discussion about?", options: ["A revision mismatch in a fictional CNC training file", "A real machine setup instruction", "A passenger information display", "A material delivery"], answerIndex: 0, explanation: "The speaker compares two versions in a training package." },
        { prompt: "What is the reviewer asked to do?", options: ["Select a file and start production", "Record the discrepancy and request clarification", "Delete the change history", "Rewrite the program without review"], answerIndex: 1, explanation: "The reviewer records the mismatch and asks the document owner to clarify." },
        { prompt: "What is the training file ID?", options: ["CNC-TR-04", "CNC-TR-40", "CNC-TB-04", "CN-TR-14"], answerIndex: 0, explanation: "Both files use CNC-TR-04." },
        { prompt: "What does the file name and header of File B show?", options: ["Revision A", "Revision B", "Revision C", "No identifier"], answerIndex: 1, explanation: "File B shows revision B in its name and header." }
      ]
    },
    {
      id: "en-c05-s02-l07",
      title: "Lesson 7 — Electrical System Fault-isolation Case Discussion",
      level: "B2",
      script: "Let us review training case ELEC-CASE-12. The report describes an indicator that was not visible in one classroom observation and was visible in a later observation. We have two observation notes and a simplified training diagram. However, the test conditions are not fully described, the diagram's applicability has not been confirmed and there is no complete measurement record. We therefore cannot identify a confirmed cause or make a statement about the condition of a real electrical system. The next step in this language exercise is to list the missing information and refer the case to the responsible instructor. Our summary must distinguish the reported symptom from any possible explanation.",
      questions: [
        { prompt: "What is the team discussing?", options: ["A fictional electrical training case", "A confirmed aircraft defect", "A real maintenance task", "A CNC production schedule"], answerIndex: 0, explanation: "The case is explicitly a classroom training scenario." },
        { prompt: "What is the main conclusion?", options: ["A component must be replaced", "The cause is confirmed", "The evidence is incomplete and the case needs review", "The diagram can be ignored"], answerIndex: 2, explanation: "Missing test conditions and measurement records prevent a conclusion." },
        { prompt: "What is the training reference?", options: ["ELEC-CASE-12", "ELEC-CASE-21", "EL-CASE-12", "ELEC-12"], answerIndex: 0, explanation: "The case reference is ELEC-CASE-12." },
        { prompt: "What evidence is supplied?", options: ["Two observation notes and a simplified training diagram", "A complete certified test report", "A signed maintenance release", "A live measurement from an aircraft"], answerIndex: 0, explanation: "The speaker identifies two notes and a simplified diagram." }
      ]
    },
    {
      id: "en-c05-s02-l08",
      title: "Lesson 8 — Software Test Results and Data-processing Reports",
      level: "B2",
      script: "This is the summary of the fictional software test set for build EDU-5. Five test cases were reviewed in the classroom environment. SW-01 and SW-04 passed. SW-02 failed because the required unit field was missing from the sample record. SW-03 generated a warning because a duplicate record ID was detected. SW-05 failed because its label mapping differed from the supplied sample dictionary. The summary identifies the observed results, but it does not establish the underlying cause of either failed test. The next step is to preserve the test references, review the input data and confirm the expected mapping with the data owner. No conclusion about real aircraft equipment can be drawn from this exercise.",
      questions: [
        { prompt: "What is being presented?", options: ["A fictional software test summary", "A live aircraft system diagnosis", "A CNC machining instruction", "A passenger boarding announcement"], answerIndex: 0, explanation: "The speaker introduces a fictional software test set." },
        { prompt: "What is the main message?", options: ["All tests passed", "Two test cases need review and one warning concerns a duplicate ID", "The software has been approved for aircraft use", "The test environment was not recorded"], answerIndex: 1, explanation: "SW-02 and SW-05 failed; SW-03 generated a duplicate-ID warning." },
        { prompt: "How many test cases are listed?", options: ["Three", "Four", "Five", "Eight"], answerIndex: 2, explanation: "Five test cases were reviewed." },
        { prompt: "Which test has a missing unit field?", options: ["SW-01", "SW-02", "SW-03", "SW-04"], answerIndex: 1, explanation: "SW-02 failed because its unit field was missing." }
      ]
    },
    {
      id: "en-c05-s02-l09",
      title: "Lesson 9 — Aircraft Component Materials and Inspection Records",
      level: "B2–B2+",
      script: "This is a review of four fictional component material records. Each record has a sample ID, a material family and a lot reference. MAT-21 and MAT-24 show certificate references and complete sample fields. MAT-22 has no certificate reference entered, so its source documentation needs clarification. MAT-23 includes a certificate reference, but the inspection scope field is incomplete. These observations describe the records only. They do not establish the physical condition or acceptance status of any real component. The next step is to refer both documentation gaps to the document owner and confirm the required supporting evidence.",
      questions: [
        { prompt: "What is the speaker reviewing?", options: ["A fictional materials register", "A real aircraft repair", "A passenger manifest", "A CNC operating sequence"], answerIndex: 0, explanation: "The speaker explicitly introduces four fictional material records." },
        { prompt: "What is the main documentation issue?", options: ["Every sample lacks a lot reference", "One certificate reference is missing and another inspection scope is incomplete", "All material families are identical", "The register has been approved for production"], answerIndex: 1, explanation: "MAT-22 lacks a certificate reference; MAT-23 has an incomplete inspection-scope field." },
        { prompt: "Which sample has no certificate reference entered?", options: ["MAT-21", "MAT-22", "MAT-23", "MAT-24"], answerIndex: 1, explanation: "The speaker identifies MAT-22." },
        { prompt: "What does a missing certificate reference prove?", options: ["The material is defective", "The material is acceptable", "It identifies a documentation gap that needs review", "It confirms corrosion"], answerIndex: 2, explanation: "A missing field is a record gap, not a conclusion about physical condition." }
      ]
    },
    {
      id: "en-c05-s02-l10",
      title: "Lesson 10 — Maintenance Planning, Reliability and Service Records",
      level: "B2–B2+",
      script: "This monthly training summary covers four fictional reporting periods. The simulated operating hours increase from one hundred and twenty in January to two hundred and ten in April. Recorded events are three in January, three in February, four in March and four in April. The event count therefore rises slightly across the sample, but the table alone does not explain why. Before interpreting the pattern, the team should check how events were defined, whether reporting practices changed and whether the data covers the same population. This classroom example does not establish a reliability rate or justify a maintenance interval change. The proposed next step is to review the data definitions and the reporting context.",
      questions: [
        { prompt: "What is the briefing about?", options: ["A fictional monthly reliability summary", "A confirmed aircraft defect", "A maintenance procedure", "A material certificate"], answerIndex: 0, explanation: "It is a classroom summary of simulated reporting periods." },
        { prompt: "What is the speaker's main point?", options: ["Event counts rose, but the data needs context", "The system has failed", "The maintenance interval must be changed", "The records can be deleted"], answerIndex: 0, explanation: "The speaker cautions against interpreting counts without context." },
        { prompt: "How many simulated operating hours are shown for April?", options: ["120", "150", "180", "210"], answerIndex: 3, explanation: "April shows 210 simulated operating hours." },
        { prompt: "How many events were recorded in March?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "March has four recorded events." }
      ]
    },
    {
      id: "en-c05-s02-l11",
      title: "Lesson 11 — Integrated Listening: Technical Briefings and Handover",
      level: "B2+",
      script: "Coordinator: Welcome to the training-project handover. We have four open review items. I will confirm the status and the next action for each one. Technologist: For materials record MAT-22, the lot reference is present, but the certificate source has not been entered. The document owner needs to confirm the reference. This is a record gap, not a material-condition conclusion. CNC instructor: The CNC training file has a revision note that does not explain the change clearly. The training coordinator will clarify the version label before the teaching pack is updated. No equipment-use decision is part of this exercise. Electrical instructor: Case ELEC-CASE-12 remains open because the supplied observations do not include a complete evidence set. The instructor will list the missing information. We have not identified a cause. Programmer: Test SW-02 failed the classroom validation because its unit field is missing. The data team will review the validation rule and the sample input. The current report does not explain why the field was absent. Coordinator: Thank you. The receiving team should preserve the four references, check each action owner and record the next update. Please keep confirmed facts separate from possible explanations.",
      questions: [
        { prompt: "What is the purpose of the meeting?", options: ["To hand over four open classroom review items", "To approve aircraft maintenance", "To issue a production release", "To cancel all documentation"], answerIndex: 0, explanation: "The coordinator describes a training-project handover." },
        { prompt: "How many items remain open?", options: ["One", "Two", "Three", "Four"], answerIndex: 3, explanation: "Four records are discussed and remain open for review." },
        { prompt: "Who is asked to confirm the MAT-22 source reference?", options: ["The document owner", "The passenger service team", "The CNC operator", "The data analyst"], answerIndex: 0, explanation: "The technologist assigns this follow-up to the document owner." },
        { prompt: "What is unclear in the CNC training file?", options: ["The revision note", "The material family", "The operating hours", "The test date"], answerIndex: 0, explanation: "The revision note does not explain the change clearly." },
        { prompt: "What is the issue with SW-02?", options: ["The unit field is missing", "The file is deleted", "The test passed", "The sample has no ID"], answerIndex: 0, explanation: "The programmer reports a missing unit field." }
      ]
    },
    {
      id: "en-c05-s02-l12",
      title: "Lesson 12 — Capstone Case: Presenting an Engineering Solution",
      level: "B2+",
      script: "Today’s project review covers four fictional records. First, materials record MAT-22 includes a lot reference, but the certificate source has not been entered. The document owner will confirm the reference. Second, CNC training file CNC-TR-04 is labelled revision B, but the change note does not explain the update and the approval status is not stated. The training coordinator will clarify the document history. Third, electrical case ELEC-CASE-12 contains two classroom observations, but the complete measurement record and test conditions are missing. No cause can be established. The instructor will list the missing information. Finally, software test SW-02 failed its simulated validation because the required unit field was absent. The data team will review the sample input and validation rule. The project presentation must distinguish these confirmed observations from open questions and must not make claims about real aircraft equipment.",
      questions: [
        { prompt: "What is the team's objective?", options: ["To approve a real aircraft for service", "To review a fictional documentation package and assign follow-up actions", "To change a CNC program", "To diagnose an electrical fault"], answerIndex: 1, explanation: "The meeting reviews fictional records and allocates follow-up." },
        { prompt: "How many records are discussed?", options: ["Two", "Three", "Four", "Five"], answerIndex: 2, explanation: "Materials, CNC, electrical and software records are discussed." },
        { prompt: "Which record needs a certificate source reference?", options: ["MAT-22", "CNC-TR-04", "ELEC-CASE-12", "SW-02"], answerIndex: 0, explanation: "MAT-22 has no certificate source entered." },
        { prompt: "Why is no electrical cause stated?", options: ["The diagram is too colourful", "The complete measurement record and test conditions are missing", "The software test passed", "The material family is unknown"], answerIndex: 1, explanation: "The case lacks the measurement record and test conditions needed to establish a cause." },
        { prompt: "What should the final presentation include?", options: ["Unsupported conclusions", "Confirmed facts, limitations, owners and follow-up actions", "A real maintenance procedure", "Invented missing values"], answerIndex: 1, explanation: "The capstone requires evidence-based reporting and explicit limitations." }
      ]
    },
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = String(text);
    return n;
  }
  function esc(s) {
    return window.escapeHtml ? window.escapeHtml(String(s == null ? "" : s)) :
      String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; });
  }
  function render() {
    var app = document.getElementById("app");
    if (!app) return;
    var courseId = String(window.state && window.state.activeCourseId || "");
    if (!window.state || (!window.state.student && !window.state.staff) ||
        (window.canAccessCourse && !window.canAccessCourse(courseId))) {
      app.innerHTML = '<section class="module">Войдите в портал и выберите доступный курс английского языка.</section>';
      return;
    }
    app.innerHTML = '<a class="backlink" href="#/">← На главную</a>' +
      '<section class="hero"><h1>English Listening Lab</h1><p>Курсы 4–5 · 3 семестровых блока · 36 аудирований · браузерное озвучивание</p></section>' +
      '<section class="module"><p>Выберите аудирование. Браузер прочитает английский текст вслух. В тренировочном режиме после ответа доступны проверка и расшифровка. Это учебные упражнения, не экзаменационные попытки.</p></section>';
    var currentSemester = "";
    activities.forEach(function (activity) {
      var courseParts = activity.id.match(/en-c(\d+)-s(\d+)-/);
      var semester = courseParts ? "Курс " + Number(courseParts[1]) + " · Семестр " + Number(courseParts[2]) : "Аудирование";
      if (semester !== currentSemester) {
        currentSemester = semester;
        app.appendChild(el("h2", "section-title", semester));
      }
      var card = el("section", "module");
      card.appendChild(el("h2", "", activity.title));
      card.appendChild(el("p", "museum-muted", "Уровень: " + activity.level));
      var mount = el("div", "english-listening-mount");
      card.appendChild(mount);
      app.appendChild(card);
      window.EnglishListeningLesson.render(mount, {
        mode: "practice",
        script: activity.script,
        lang: "en-GB",
        repeatCount: 2,
        rate: 0.88,
        questions: activity.questions
      });
    });
  }

  window.EnglishListeningCatalogue = { render: render, count: activities.length };
})();
