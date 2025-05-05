import { useState } from 'react';
import { hp } from '../../Utils/dimension';
import { useSetAuthValue } from '../../atoms/auth';
import AcceptTerms from '../../components/AcceptTerms';
import { RoundedTopBar } from '../../components/loginFlow/roundedTopBar';
import { baseColors } from '../../constants/colors';
import { LoggedOutStackParamsList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Checkbox, Div, ScrollDiv, Text } from 'react-native-magnus';
import AppUtils from '../../Utils/appUtils';

export function TermsAndConditions({ navigation }: NativeStackScreenProps<LoggedOutStackParamsList, 'termsAndConditions'>) {
  const setAuth = useSetAuthValue();
  const [isChecked, setIsChecked] = useState(false)

  return (
    <Div bg={baseColors.white} h="100%">
      <RoundedTopBar optionalBackUrl="nameInput" title="Terms and Conditions" />

      <ScrollDiv mx={20} mt={20} mb={100}>
        <Text mb={8} lineHeight={18}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, id! Repellat sapiente ut explicabo, et saepe dicta. Velit cum fugit
          distinctio, laborum eaque odio ea quas rerum officia molestiae saepe eligendi? Obcaecati dicta ea aperiam aspernatur et dolores,
          consequuntur saepe autem. Similique voluptates, aspernatur, facere molestias dolorum tenetur amet vel quo, pariatur at placeat autem neque
          ipsam reprehenderit eaque? Nesciunt voluptatum accusantium fuga non laudantium atque assumenda quae odio animi asperiores officia vitae
          doloremque deserunt recusandae deleniti, dolorem iste pariatur. Unde placeat tempora rem doloremque similique, totam, deserunt molestias qui
          iure inventore porro illum. Nulla cum maxime corporis velit architecto?
        </Text>

        <Text mb={8} lineHeight={18}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, id! Repellat sapiente ut explicabo, et saepe dicta. Velit cum fugit
          distinctio, laborum eaque odio ea quas rerum officia molestiae saepe eligendi? Obcaecati dicta ea aperiam aspernatur et dolores,
          consequuntur saepe autem. Similique voluptates, aspernatur, facere molestias dolorum tenetur amet vel quo, pariatur at placeat autem neque
          ipsam reprehenderit eaque? Nesciunt voluptatum accusantium fuga non laudantium atque assumenda quae odio animi asperiores officia vitae
          doloremque deserunt recusandae deleniti, dolorem iste pariatur. Unde placeat tempora rem doloremque similique, totam, deserunt molestias qui
          iu
        </Text>

        <Text mb={8} lineHeight={18}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, id! Repellat sapiente ut explicabo, et saepe dicta. Velit cum fugit
          distinctio, laborum eaque odio ea quas rerum officia molestiae saepe eligendi? Obcaecati dicta ea aperiam aspernatur et dolores,
          consequuntur saepe autem. Similique voluptates, aspernatur, facere molestias dolorum tenetur amet vel quo, pariatur at placeat autem neque
          ipsam reprehenderit eaque? Nesciunt voluptatum accusantium fuga non laudan
        </Text>

        <Text mb={8} lineHeight={18}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, id! Repellat sapiente ut explicabo, et saepe dicta. Velit cum fugit
          distinctio, laborum eaque odio ea quas rerum officia molestiae saepe eligendi? Obcaecati dicta ea aperiam aspernatur et dolores,
          consequuntur saepe autem. Similique voluptates, aspernatur, facere molestias dolorum tenetur amet vel quo, pariatur
        </Text>
      </ScrollDiv>

      <Div my={10} w="100%" bottom={0} borderTopWidth={2} position="absolute" borderTopColor="lightgray">
        {/* <Checkbox
          my={5}
          mx={10}
          defaultChecked
          activeColor={baseColors.theme}
          suffix={
            <Text fontSize="sm" color="gray600" pl={10}>
              I accept all Terms & Conditions*
            </Text>
          }
        /> */}
        <AcceptTerms onPress={()=>setIsChecked(!isChecked)} isChecked={isChecked} />
        <Button
          w="95%"
          mx="auto"
          px={36}
          py={12}
          mt={hp(1)}
          fontSize="lg"
          fontWeight="500"
          bg={baseColors.theme}
          color={baseColors.white}
          onPress={() =>{
            if(!isChecked){
              AppUtils.showToast_error('Please accept terms & conditions')
              return
            }
            navigation.navigate('Questions')
            setAuth(prev => ({ ...prev, isAuthenticated: true }))}}
            
            >
          Continue
        </Button>
      </Div>
    </Div>
  );
}
