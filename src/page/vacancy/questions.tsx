import Navbar from "@/components/common/navbar";
import Question from "@/components/questions/question";

const Questions = () => {
  return (
    <>
      <Navbar isHome={false} />
      <div className="h-full px-72 flex flex-col gap-8 py-8">
        <div className="font-bold text-4xl text-center pt-10 text-primary-blue">Possible interview questions</div>
        <div className="flex w-full text-white font-bold text-3xl bg-primary-blue py-8 justify-center rounded-lg">
            Data Analyst at Gojek
        </div>
        <div className="flex flex-col gap-10 items-center h-fit ">
          {dummyQuestions.map((question, index) => (
            <Question key={index} question={question.question} answer={question.answer} />
          ))}
        </div>
      </div>
    </>
  );
};

const dummyQuestions = [
  {
    question: "What is climate change?",
    answer:
      "Climate change refers to long-term shifts and alterations in temperature and weather patterns. While some of these changes may be natural, since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil, and gas. These activities release greenhouse gases such as carbon dioxide, which trap heat in the Earth's atmosphere and cause the planet to warm.",
  },
  {
    question: "What are the benefits of exercise?",
    answer:
      "Regular exercise offers numerous health benefits, both physically and mentally. It helps in maintaining a healthy weight, strengthens the heart and lungs, improves muscle strength and flexibility, and enhances the immune system. Mentally, exercise can reduce symptoms of anxiety, depression, and stress, while also improving mood, boosting energy levels, and promoting better sleep. Consistency in physical activity is key to reaping these benefits.",
  },
  {
    question: "How does photosynthesis work?",
    answer:
      "Photosynthesis is a process used by plants, algae, and some bacteria to convert light energy, usually from the sun, into chemical energy in the form of glucose. During photosynthesis, plants absorb sunlight using a pigment called chlorophyll, primarily found in their leaves. They also take in carbon dioxide from the air and water from the soil. Through a series of chemical reactions, they transform these substances into glucose and oxygen. The glucose is used by the plant for energy and growth, while the oxygen is released into the atmosphere as a byproduct.",
  },
  {
    question: "What caused the fall of the Roman Empire?",
    answer:
      "The fall of the Roman Empire was a complex process influenced by multiple factors over many years. Some of the primary reasons include economic troubles and over-reliance on slave labor, military overspending, and overexpansion of the empire. Additionally, internal strife, political corruption, and the weakening of Roman legions due to invasions by barbarian tribes like the Visigoths and Vandals contributed to the empire's collapse. By the end of the 5th century, the Western Roman Empire had crumbled, although the Eastern Roman Empire (Byzantine Empire) continued for several more centuries.",
  },
  {
    question: "What is artificial intelligence?",
    answer:
      "Artificial intelligence (AI) is a branch of computer science focused on creating machines or systems that can perform tasks typically requiring human intelligence. These tasks include learning, reasoning, problem-solving, understanding language, and recognizing patterns. AI can be categorized into narrow AI, which is designed for specific tasks like facial recognition or voice assistants, and general AI, which aims to understand and perform any intellectual task that a human can. AI has the potential to transform industries, improve efficiency, and solve complex global problems, though it also raises ethical concerns around job displacement and privacy.",
  },
];

export default Questions;
