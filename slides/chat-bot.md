---
title: Chat Bots on Azure
summary: Working with Microsoft QnA Maker + Bot Framework
# theme: default
---

# Chat Bots on Azure

## Working with Microsoft QnA Maker + Bot Framework

### By Kyle Mitofsky, Principle Developer at Vermont Department of Health

<a href="https://twitter.com/KyleMitBTV" class="icon-link">
    <!-- {% include "assets/images/icons/fa/twitter.svg" %} -->
    <!-- TODO: process via njk *then* md -->
    @KyleMitBTV
</a>


---

## Recording - 7/16/20

<iframe width="1903" height="800" src="https://www.youtube.com/embed/YNBwSuICVac" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## Overview

* Acknowledgements
* Chat Bot Demo
* Technologies
* Training
* Pricing
* Lessons Learned
* Azure Demo
* Resources

---


## Acknowledgements

* **Maintenance & Operations (MO) Team**
  * John Mathias
  * Katie Jones
  * Sandra LeBlanc
  * John Hanning
  * Grace Demler
* **VDH Communications Team**
  * Sharon Muellers
  * Christie Vallencourt
  * Amelia Ray
* **ADS Partners**
  * Josiah Raiche
  * Timothy Hannett
* **MS Partners**
  * Mike Hacker
  * Russ Williams

---

## Chat Bot Demo

<iframe src="https://webchat.botframework.com/embed/sov-covid-bot-chat/gemini?b=sov-covid-bot-chat&s=tOBWLdNVDOg.o6jHTSPmdlBEygcNAoyqV3M-kx1TSgXjtqt2JMWOEXE&username=You" style="border: 1px solid black; min-width: 400px; min-height: 250px; height: 400px; resize: vertical;"></iframe>


---

## Demo Sites

* BOT - https://apps-test.health.vermont.gov/COVID/
* FAQ - https://apps-test.health.vermont.gov/COVID/faq/


---

## Technology Stack

* [QnA Maker](https://www.qnamaker.ai/)
* [Bot Framework](https://dev.botframework.com/)
* [Eleventy](https://www.11ty.dev/)
* Markdown 🎉


---

## QnA Maker


* Knowledge Base
* Rich Text Editor (*finally*)
  * As of Build 2020

---

### QnA Maker GUI

![QnA Maker GUI](/assets/images/slides/chat-bot/qna-maker-gui.png)

---

### QnA Maker Data

```json
{
    "id": 4534,
    "answer": "**What are the symptoms of COVID-19?**\n\nPeople with COVID-19 have had a wide range of symptoms reported – ranging from mild symptoms to severe illness. Symptoms may appear 2 to 14 days after exposure to the virus. ...",
    "source": "KB-COVID",
    "questions": [
        "What are the symptoms of COVID-19?",
        "How can I tell if I have Covid-19?",
        "what symptoms should I look for",
    ],
    "metadata": [
        {"name": "category","value": "symptoms and sickness"},
        {"name": "subcategory","value": "symptoms"},
    ],
}
```


---

### Qna Maker API

* Look at in [Postman](https://www.postman.com/)
* Import [Collection](https://github.com/VermontDepartmentOfHealth/covid-bot/tree/master/kb-api)
* Only way to modify "Alterations"


---

## Bot Framework

> Create a bot with the ability to speak, listen, understand, and learn from your users with Azure Cognitive Services.

---

### Bot Channels

* Web Chat
* Slack
* MS Teams
* Twilio / SMS
* Alexa
* ...

---

### [Bot Framework Web Chat](https://github.com/microsoft/BotFramework-WebChat)

* Change colors
* Change sizes
* Update/replace CSS styles
* Listen to events
* Interact with hosting webpage
* **Plus React**
  * Custom render activities
  * Custom render attachments
  * Add new UI components
  * Recompose the whole UI

---

## FAQ Site

---

### Eleventy

* Static Site Generator
* Live Data over API

<!-- https://www.staticgen.com/ -->

---

#### Structured Data

Use [FAQ Structured Data](https://developers.google.com/search/docs/data-types/faqpage)


```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": " What are the symptoms of COVID-19?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "People with COVID-19 have had a wide range of symptoms reported – ranging from mild symptoms to severe illness. Symptoms may appear 2 to 14 days after exposure to the virus. Not everyone infected with the COVID-19 virus has symptoms. People with these symptoms may have COVID-19:"
      }
    }
  ]
}
```

---

## Triage & Training

* **Triage** (labor hours)
  * **Training Opportunity** - Query should have matched to better Answer
  * **Missing FAQ** - Answer doesn't yet exist in knowledge base
* **Training**
  * **Alternative Phrases** - question level
  * **Alterations** - word level

---

### Application Insights

```kql
traces
| where message contains "GenerateAnswer"
| extend input = tostring(customDimensions.Question),
        answer = tostring(customDimensions.Answer),
        scoreInt = toint(round(todouble(customDimensions.Score))),
        convoId = substring(itemId, 0, 7)
```

<!-- projection operations / predicate operations -->

---

## Pricing


| **Service**                | **Test**      | **Prod**         |  **Total**  |
|----------------------------|---------------|------------------|:-----------:|
| **Azure Cognitive Search** | F - $0/mo     | B - $75/mo       |  $75/mo     |
| **App Services Plan**      | D1 - $9.50/mo | S1 - $73/mo      |  $82/mo     |
| **Cognitive Services**     | F0 - $0/mo    | S0 - $10/mo      |  $10/mo     |
| **Bot Services**           | F0 - $0/mo    | S1 - $.50/1k msg |  $6/mo      |
| **Total**                  | $9/mo         | $164/mo          | $174/mo     |

---

## Lessons Learned

---

### Lesson #1

> Plan a lot of time for training

<!--
our accuracy rates were really bad
look at google docs her
-->

---

### Lesson #2

> Get content authors involved early

<!-- Bot answers are a different breed of answer -->

---

## Tips & Tricks

---

### Tip #1

**Problem**: Multi-authoring editing is still difficult

**Solution**: Use MS Teams / IM to manage authoring

---


### Tip #2

**Problem**: Question order isn't deterministic

**Solution**: Repeat question wording in answer

<!-- we actually treat the question in the answer body  as our canonical wording  -->
<!-- also helps when cognitive services matches on opposite -->

---


### Tip #3

**Problem**: IDs are lossy during publish

**Solution**: Use API and *lots* of logic

<!-- publish really just does a replace -->

---


## Demo

1. Create Knowledge Base - [https://www.qnamaker.ai/](https://www.qnamaker.ai/)
2. Add chitchat + question
3. Test / Train
4. Publish
5. Create Bot
6. Embed Bot

<!-- make sure to verify create  -->


---

## Resources

---

### VDH Dev Links


#### Chat Bot Presentation ⭐ <-- you are here

[docgov.dev/slides/chat-bot/](https://docgov.dev/slides/chat-bot/)

#### Covid Bot Repo

[VermontDepartmentofHealth.github.io/covid-bot/](https://vermontdepartmentofhealth.github.io/covid-bot/)

---

### Community Resources

* **Microsoft - Chatbot Starter** - https://microsoft.github.io/slg-covid-bot/
* **QnA Maker** - https://www.qnamaker.ai/
* **Azure Bot Service** - https://azure.microsoft.com/en-us/services/bot-service/

---

## Thank You!
