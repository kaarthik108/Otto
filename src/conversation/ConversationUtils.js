import { Tasks } from "state/StateTypes"

export const getWitResult = async (wit, utterance) => {
    return await wit.message(utterance);
}

export const extractSampleDataset = (statement) => {
    let sampleDataset = null;
    let matchedKeywords = null;
    let matchedTask = null;
    return [matchedTask, sampleDataset, matchedKeywords];
} 

const intentToTask = {
    task_reg: [Tasks.REGRESSION],
    task_class: [Tasks.CLASSIFICATION],
    task_nlp: [Tasks.NATURAL_LANGUAGE],
}

export const extractTask = (witResponse) => { // TODO: threshold
    let intents = witResponse.intents;
    let task = null;
    if (intents.length > 0) {
        let topIntent = intents[0];
        let topIntentName = topIntent.name;
        task = intentToTask[topIntentName];
    }
    return task;
}

export const extractSubject = (witResponse) => {
    let entities = witResponse.entities;
    let subject = null;
    if ("subject:subject" in entities) {
      let subjectArray = entities["subject:subject"];
      let subjectObject = subjectArray[0];
      subject = subjectObject["body"];
    }
    return subject;
}