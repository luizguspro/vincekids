import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "Qual o prazo de entrega?",
    answer:
      "O prazo varia de acordo com sua região. Para capitais do Sudeste, geralmente é de 2 a 4 dias úteis. Você pode simular o prazo exato no carrinho de compras.",
  },
  {
    question: "Como funciona a troca?",
    answer:
      "A primeira troca é grátis! Você tem até 7 dias após o recebimento para solicitar. Importante: A peça deve estar com a etiqueta Vince Kids fixada e sem sinais de uso.",
  },
  {
    question: "Quais as formas de pagamento?",
    answer:
      "Aceitamos cartão de crédito em até 6x sem juros, PIX com 5% de desconto e boleto bancário.",
  },
  {
    question: "As roupas encolhem na lavagem?",
    answer:
      "Trabalhamos com tecidos de alta qualidade (algodão premium e linho) que passam por pré-lavagem. Seguindo as instruções da etiqueta, o encolhimento é mínimo ou inexistente.",
  },
  {
    question: "Como saber o tamanho ideal?",
    answer:
      "Recomendamos consultar nossa Tabela de Medidas disponível na página de cada produto. Na dúvida, sugerimos sempre um tamanho maior para maior aproveitamento.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-14 sm:py-20 bg-white relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm tracking-wide mb-3 sm:mb-4">
            <HelpCircle className="h-4 w-4" />
            Dúvidas Frequentes
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-primary mb-3 sm:mb-4">
            Posso ajudar?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Separamos as respostas para as perguntas mais comuns de nossos clientes.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/60 rounded-2xl px-4 sm:px-6 bg-[#FDFDFD] data-[state=open]:bg-secondary/5 data-[state=open]:border-secondary/30 transition-all duration-300"
            >
              <AccordionTrigger className="text-left font-bold text-foreground hover:text-primary hover:no-underline py-4 sm:py-6 text-base sm:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4 sm:pb-6 text-sm sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
